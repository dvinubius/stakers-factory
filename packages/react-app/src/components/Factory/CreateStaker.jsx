import { CheckCircleOutlined, PlusOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, Spin } from "antd";
import { useContractLoader } from "eth-hooks";
import React, { useEffect, useState } from "react";
import { Transactor } from "../../helpers";
import {
  dialogOverlayGradient,
  errorColor,
  mainColWidth,
  mediumButtonMinWidth,
  primaryColor,
  softTextColor,
} from "../../styles";
import CustomEtherInput from "../CustomKit/CustomEtherInput";
import { calcSeconds, generateAltUnitText } from "./helpers";
const { ethers } = require("ethers");

const CreateStaker = ({ userSigner, gasPrice, contractConfig, localChainId, price }) => {
  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  const [visibleModal, setVisibleModal] = useState(false);
  const [pendingCreate, setPendingCreate] = useState(false);
  const [txSent, setTxSent] = useState(false);
  const [txError, setTxError] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  const [durationSeconds, setDurationSeconds] = useState();

  const [unitAltDisplay, setUnitAltDisplay] = useState("");

  const resetMeself = () => {
    setDurationSeconds(null);
    setUnitAltDisplay("");
    setPendingCreate(false);
    setTxSent(false);
    setTxError(false);
    setTxSuccess(false);
    form.resetFields();
  };

  const [form] = Form.useForm();

  const updateDuration = dur => {
    const unit = form.getFieldValue("durationUnit");
    _updateDuration(dur, unit);
  };
  const updateDurationUnit = unit => {
    const dur = form.getFieldValue("duration");
    _updateDuration(dur, unit);
  };

  const _updateDuration = (dur, unit) => {
    if (!dur || +dur <= 0) {
      setDurationSeconds(null);
      return;
    }
    const seconds = calcSeconds(+dur, unit);
    const altText = generateAltUnitText(+dur, unit);
    setDurationSeconds(seconds);
    setUnitAltDisplay(altText);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setPendingCreate(true);
      const name = form.getFieldValue("name");
      const threshold = ethers.utils.parseUnits(form.getFieldValue("threshold"), "ether").toString();
      const transaction = writeContracts.StakerFactory.createStakerContract(name, durationSeconds, threshold);
      tx(transaction, update => {
        if (update && (update.error || update.reason)) {
          setPendingCreate(false);
          setTxError(true);
        }
        if (update && (update.status === "confirmed" || update.status === 1)) {
          setPendingCreate(false);
          setTxSuccess(true);
        }
        if (update && update.code) {
          // metamask error etc.
          setPendingCreate(false);
          setTxSent(false);
        }
      });
      setTxSent(true);
    } catch (e) {
      // form will show errors
      console.log("Form validation failed: ", e);
    }
  };

  const handleCancel = () => {
    setVisibleModal(false);
    resetMeself();
  };

  const handleRetry = () => {
    setTxError(false);
    setTxSent(false);
  };

  const formSize = "medium";
  const labelFontSize = formSize === "large" ? "1rem" : "0.875rem";
  const formWidthRem = 25;
  const colSpanLabel = 6;
  const colSpanInput = 19;

  const positiveAmountValidator = (_, value) => {
    const errorMessage = isNaN(+value) ? "Please provide a number" : +value <= 0 ? "Must be positive" : "";
    return !errorMessage ? Promise.resolve() : Promise.reject(new Error(errorMessage));
  };

  return (
    <div>
      <Button type="primary" onClick={() => setVisibleModal(true)}>
        <PlusOutlined />
        New Staker
      </Button>

      <Modal
        title="Create a New Staker Contract"
        style={{ top: 120 }}
        visible={visibleModal}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={mainColWidth}
        footer={
          txSent
            ? [
                <Button key={1} type="default" style={{ minWidth: mediumButtonMinWidth }} onClick={handleCancel}>
                  {txSuccess ? "Thanks" : "Close"}
                </Button>,
                txError && (
                  <Button key={2} type="primary" style={{ minWidth: mediumButtonMinWidth }} onClick={handleRetry}>
                    Retry
                  </Button>
                ),
              ]
            : [
                <Button key={1} type="default" style={{ minWidth: mediumButtonMinWidth }} onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button
                  key={2}
                  type="primary"
                  style={{ minWidth: mediumButtonMinWidth }}
                  loading={pendingCreate}
                  onClick={handleSubmit}
                >
                  Create
                </Button>,
              ]
        }
      >
        {txSent && (
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: 55,
              bottom: 53,
              left: 0,
              width: "100%",
              pointerEvents: "none",
              background: dialogOverlayGradient,
              backdropFilter: "blur(2px)",

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            {txError && (
              <>
                <div style={{ fontSize: "1.5rem" }}>{"Transaction failed"}</div>
                <StopOutlined style={{ color: errorColor, fontSize: "4rem" }} />
              </>
            )}
            {txSuccess && (
              <>
                <div style={{ fontSize: "1.5rem" }}>{"Contract Created!"}</div>
                <CheckCircleOutlined style={{ color: primaryColor, fontSize: "4rem" }} />
              </>
            )}
            {!txError && !txSuccess && (
              <>
                <div style={{ fontSize: "1.5rem" }}>{"Creating Contract"}</div>
                <div style={{ height: "4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Spin size="large" style={{ transform: "scale(1.5)" }} />
                </div>
              </>
            )}
          </div>
        )}
        <Form
          form={form}
          style={{
            width: `${formWidthRem}rem`,
            margin: "1.5rem auto 0 2.5rem",
            pointerEvents: txSent ? "none" : "all",
          }}
          size={formSize}
          initialValues={{
            durationUnit: "days",
          }}
        >
          <Form.Item
            style={{ justifyContent: "center" }}
            label={<span style={{ fontSize: labelFontSize }}>Name</span>}
            name="name"
            required
            labelCol={{ span: colSpanLabel }}
            wrapperCol={{ span: colSpanInput }}
            rules={[{ required: true, message: "Please input a name" }]}
          >
            <Input type="text" placeholder="Name your contract" />
          </Form.Item>

          <Form.Item
            style={{ justifyContent: "center" }}
            label={<span style={{ fontSize: labelFontSize }}>Threshold</span>}
            name="threshold"
            required
            labelCol={{ span: colSpanLabel }}
            wrapperCol={{ span: colSpanInput }}
            rules={[
              { required: true, message: "Please input an amount" },
              {
                validator: positiveAmountValidator,
              },
            ]}
          >
            <CustomEtherInput price={price} etherMode autofocus={false} />
          </Form.Item>
          <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            <Form.Item
              style={{ justifyContent: "center" }}
              label={<span style={{ fontSize: labelFontSize }}>Duration</span>}
              name="duration"
              labelCol={{ span: colSpanLabel }}
              wrapperCol={{ span: colSpanInput }}
              rules={[
                { required: true, message: "Please input an amount" },
                {
                  validator: positiveAmountValidator,
                },
              ]}
            >
              <InputNumber
                addonAfter={
                  <Form.Item name="durationUnit" noStyle>
                    <Select style={{ width: "7.8rem" }} onChange={updateDurationUnit}>
                      <Option value="days">days</Option>
                      <Option value="hours">hours</Option>
                      <Option value="minutes">minutes</Option>
                      <Option value="seconds">seconds</Option>
                    </Select>
                  </Form.Item>
                }
                placeholder="Until deadline"
                min={1}
                style={{ width: "100%" }}
                onChange={updateDuration}
              />
            </Form.Item>
            <div
              style={{ position: "absolute", top: "2.7rem", right: 0, fontSize: labelFontSize, color: softTextColor }}
            >
              {unitAltDisplay}
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateStaker;
