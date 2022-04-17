import React, { useEffect, useReducer, useState } from 'react';
import './App.css';
import Dice from './components/Dice';
import DividerDesktop from './components/DividerDesktop';
import DividerMobile from './components/DividerMobile';
import * as Types from './reducers/Types';
import Loading from './components/Loading';

const reducer = (state, action) => {
  switch (action.type) {
    case Types.IS_LOADING:
      return { ...state, isloading: true, error: null };
    case Types.ERROR:
      return { ...state, error: action.payload };
    case Types.SUCCESS:
      return { ...state, slip: action.payload, isloading: false, error: null };
    default:
      throw new Error();
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    isloading: false,
    error: null,
    slip: null,
  });

  const [width, setWidth] = useState(window.outerWidth);

  const load_advice = () => {
    fetch('https://api.adviceslip.com/advice')
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((json) => {
        dispatch({
          type: Types.SUCCESS,
          payload: json.slip,
        });
      })
      .catch((err) => dispatch({ type: Types.ERROR, payload: err.message }));
  };

  const clickHandler = () => {
    dispatch({ type: Types.IS_LOADING });

    setTimeout(load_advice, 2000);
  };

  function onWindowResize() {
    setWidth(window.outerWidth);
  }

  useEffect(() => {
    dispatch({ type: Types.IS_LOADING });
    setTimeout(load_advice, 2000);
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);
  return (
    <div className="main">
      <div className="advice-box">
        {state.isloading && <Loading />}
        {state.error && <p>{state.error}</p>}
        {!state.isloading && state.slip && (
          <div>
            <h5>Advice #{state.slip.id.toString()}</h5>
            <p className="quote">{state.slip.advice}</p>
          </div>
        )}
        {width <= 1200 ? <DividerMobile /> : <DividerDesktop />}
        <div className="dice-btn" onClick={clickHandler}>
          <Dice />
        </div>
      </div>
    </div>
  );
};

export default App;
