'use client'

import {  useEffect } from 'react';

import initCursor from '@/shared/utils/useShadowCursor'


const Index = () => {

  useEffect(() => {
    initCursor();
  }, [])
  return (
    <div className='h-screen w-full fixed top-0 left-0 z-[-1] '>
      <canvas id="fluid" className='w-full h-full' />
    </div>
  );
};
export default Index;
