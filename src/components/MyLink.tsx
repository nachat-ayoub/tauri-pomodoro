import React, { useRef } from 'react';
import { LinkProps, useNavigate } from 'react-router-dom';

interface MyLinkProps extends LinkProps {
  waitForAnimation?: boolean;
  waitTime?: number;
}

const MyLink: React.FC<MyLinkProps> = ({
  waitForAnimation = true,
  waitTime = 250,
  ...props
}) => {
  const navigate = useNavigate();
  const sidebarTogglerRef = useRef<HTMLLabelElement>(null);

  const navigateTo = () => {
    if (waitForAnimation) {
      if (sidebarTogglerRef.current) {
        sidebarTogglerRef.current.click();
      }
      setTimeout(() => navigate(props.to), waitTime);
    } else navigate(props.to);
  };

  return (
    <>
      <label
        ref={sidebarTogglerRef}
        htmlFor='sidebar'
        className='hidden'
      ></label>

      <div className={props.className} onClick={navigateTo}>
        {props.children}
      </div>
    </>
  );
};

export default MyLink;
