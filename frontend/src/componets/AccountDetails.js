import React from "react";
import { Card } from "antd";
import { UserOutlined } from "@ant-design/icons";

function AccountDetails({ address, name, balance }) {
  return (
    <Card title="Account Details" style={{ width: "100%" }}>
      <div className="accountDetailRow">
        <UserOutlined style={{ color: "#767676", fontSize: "25px" }} />
        <div>
          <div className="accountDetailHead"> {name} </div>
          <div className="accountDetailBody">
            {" "}
            Address: {address.slice(0, 4)}...{address.slice(38)}
          </div>
        </div>
      </div>
      <div className="accountDetailRow">
        <div>
          <div className="accountDetailHead"> Native Matic Tokens</div>
        </div>
      </div>
     
    </Card>
  );
}

export default AccountDetails;
