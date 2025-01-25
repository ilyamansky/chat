import React, { useEffect } from "react";
import { components } from "react-select";
import CustomScrollbar from "./CustomScrollbar";

const MenuList = ({ children, innerRef, ...props }) => {
  const intermediateRef = React.useRef();

  useEffect(() => {
    innerRef(intermediateRef.current ? intermediateRef.current.view : null);
  }, [innerRef, intermediateRef]);

  return (
    <components.MenuList {...props}>
      <div style={{ height: 200 }}>
        <CustomScrollbar ref={intermediateRef}>{children}</CustomScrollbar>
      </div>
    </components.MenuList>
  );
};
export default MenuList;
