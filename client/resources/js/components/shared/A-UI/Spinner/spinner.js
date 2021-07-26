import React, { useState } from "react";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Spinner = ({ loading }) => {
    let [color, setColor] = useState("#ffffff");

    return (
        <div className="sweet-loading">
            <ClipLoader color={color} loading={loading} css={override} size={150} />
        </div>
    );
}

export default Spinner