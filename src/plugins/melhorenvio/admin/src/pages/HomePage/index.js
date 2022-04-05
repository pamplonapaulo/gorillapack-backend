/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState, memo } from 'react';
// import PropTypes from 'prop-types';
import * as S from './styles';
import { fetchCredentials } from '../../utils/api';

import Brand from '../../components/Brand';

const HomePage = () => {
  const [credentials, setCredentials] = useState({})

  useEffect(async () => {
    const credents = await fetchCredentials()
    setCredentials(credents[0]);
  }, []);

  const handleRegisterAgain = () => {
    (async() => {
      console.log('credentials: ', credentials)
      return
    })()
  }

  return (
    <div>
      <br/>
      <h1>Melhor Envio</h1>
      <br/>
      <a href="https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=2385&redirect_uri=https://gorilla.vercel.app&response_type=code&scope=shipping-calculate" target="_blank">
        <button>Reset</button>
      </a>

      <Brand />

      <S.Container>
        <S.Subtitle>client_id: {credentials.client_id}</S.Subtitle>
        <S.Subtitle>client_secret: {credentials.client_secret}</S.Subtitle>
      </S.Container>

      <S.Container>
        <S.Subtitle>redirect_uri: {credentials.redirect_uri}</S.Subtitle>
        <S.Subtitle>code: {credentials.code}</S.Subtitle>
      </S.Container>

      <S.Container>
        <S.Subtitle>access_token: {credentials.access_token}</S.Subtitle>
        <S.Subtitle>refresh_token: {credentials.refresh_token}</S.Subtitle>
      </S.Container>

      <S.Container>
        <S.Subtitle>createdAt: {credentials.createdAt}</S.Subtitle>
        <S.Subtitle>updatedAt: {credentials.updatedAt}</S.Subtitle>
      </S.Container>

      <S.Container>
        <S.Wrap onClick={handleRegisterAgain}>
          <S.Btn>Renovar</S.Btn>
        </S.Wrap>
      </S.Container>

    </div>
  );
};

export default memo(HomePage);
