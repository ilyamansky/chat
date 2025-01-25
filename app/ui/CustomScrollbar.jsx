// CustomScrollbar.js
"use client";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

const CustomScrollbar = ({ children }) => {
  return (
    <Scrollbars
    //autoHide
    //renderThumbVertical={renderThumbVertical}
    //renderTrackHorizontal={renderTrackHorizontal}
    //style={{ maxHeight:  }}
    >
      {children}
    </Scrollbars>
  );
};

export default CustomScrollbar;
