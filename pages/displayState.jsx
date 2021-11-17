import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Highlight from '../components/Highlight';

function DisplayState() {
  const [state, setState] = useState({ isLoading: false, response: undefined, error: undefined });

  const callApi = async () => {
    setState(previous => ({ ...previous, isLoading: true }))

    try {
      const response = await fetch('/api/displayState');
      const data = await response.json();

      setState(previous => ({ ...previous, response: data, error: undefined }))
    } catch (error) {
      setState(previous => ({ ...previous, response: undefined, error }))
    } finally {
      setState(previous => ({ ...previous, isLoading: false }))
    }
  };

  const handle = (event, fn) => {
    event.preventDefault();
    fn();
  };

  const { isLoading, response, error } = state;

  return (
    <>
      <div className="mb-5" data-testid="external">
        <h1 data-testid="external-title">External API</h1>
        <div data-testid="external-text">

        </div>
        <Button color="primary" className="mt-5" onClick={e => handle(e, callApi)} data-testid="external-action">
          Ping API
        </Button>
      </div>
      <div className="result-block-container">
        {isLoading && <Loading />}
        {(error || response) && (
          <div className="result-block" data-testid="external-result">
            <h6 className="muted">Result</h6>
            {error && <ErrorMessage>{error.message}</ErrorMessage>}
            {response && <Highlight>{JSON.stringify(response, null, 2)}</Highlight>}
          </div>
        )}
      </div>
    </>
  );
}

export default withPageAuthRequired(DisplayState, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
