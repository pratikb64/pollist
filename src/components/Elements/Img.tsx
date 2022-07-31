import Image, { ImageProps } from 'next/image';
import React from 'react';

const Img: React.FC<ImageProps> = ({
  layout = 'fill',
  className,
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      <Image alt={props.alt} {...props} layout={layout} />
    </div>
  );
};

export default Img;
