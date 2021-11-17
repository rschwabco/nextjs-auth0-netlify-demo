import React from 'react';

import { useUser } from '@auth0/nextjs-auth0';
import Hero from '../components/Hero';
import Content from '../components/Content';

export default function Index() {
  const { user, isLoading } = useUser();
  return (
      <>
      <Hero />
      <hr />
      <Content />
      </>
  );
}
