import { Card, Descriptions } from "antd";
import React from "react";
import { softTextColor } from "../../styles";
import CustomAddress from "../CustomKit/CustomAddress";

const AllStakers = ({ contracts, openContract }) => {
  const cellHeight = "2.5rem";
  return (
    <div style={{ width: "28rem", margin: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {contracts.map(c => (
        <div key={c.address}>
          <Card
            size="small"
            className="hoverableLight"
            onClick={() => openContract(c)}
            title={
              <div
                style={{
                  padding: "0 0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  justifyContent: "space-between",
                  fontWeight: 400,
                }}
              >
                <div style={{ fontSize: "1rem", fontWeight: 500 }}>{c.name}</div>
                <CustomAddress noBlockie={true} fontSize="1rem" value={c.address} />
              </div>
            }
          >
            <div style={{ padding: "0.5rem" }}>
              <Descriptions bordered size="small" labelStyle={{ textAlign: "center", height: cellHeight }}>
                <Descriptions.Item
                  label="Created"
                  labelStyle={{ color: softTextColor }}
                  contentStyle={{
                    padding: "0 1rem",
                    width: "10rem",
                  }}
                  span={4}
                >
                  <div>{c.time.toLocaleString()}</div>
                </Descriptions.Item>
                <Descriptions.Item
                  label="By"
                  labelStyle={{ color: softTextColor }}
                  contentStyle={{
                    padding: "0 1rem",
                    height: cellHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <CustomAddress fontSize={14} value={c.creator} />
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default AllStakers;
