/*
 *
 * HomePage Melhor Envio Plugin
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
    const credents = await fetchCredentials();
    setCredentials(credents[0]);
  }, []);

  const convertDate = (date) => new Date(date).toLocaleDateString('pt-BR');

  const showTime = (t) => t.getHours() + ":"
      + (t.getMinutes() < 10 ? '0' : '' ) + t.getMinutes() + " de "
      + t.getDate() + "/"
      + (t.getMonth()+1)  + "/"
      + t.getFullYear();

  return (
    <>
      <S.Container>
        <Brand />
      </S.Container>

      <S.Container>
        <S.Subtitle>Verifique se o seu plugin Melhor Envio contém credenciais válidas. Caso as credenciais do lojista não estejam válidas, será necessário que seus dados e preferências sejam recadastrados no plugin do desenvolvedor. Para tal, clique no botão abaixo e preencha o formulário na página para a qual você será redirecionado. Após gravar seus dados, você será redirecionado novamente. Aguarde a mensagem final confirmando a atualização das suas credenciais.</S.Subtitle>

        <S.Anchor href={`https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=${credentials.client_id}&redirect_uri=${credentials.redirect_uri}&response_type=code&scope=shipping-calculate`} target="_blank">
          <S.Btn>Recadastrar</S.Btn>
        </S.Anchor>
      </S.Container>

      <S.Container>
        <S.Row>
          <S.Column>
            <S.Subtitle>Última atualização de Token:</S.Subtitle>
            <S.InnerContainer>
              <S.Subtitle>{convertDate(credentials.updatedAt)}</S.Subtitle>
            </S.InnerContainer>
          </S.Column>
          <S.Column>
            <S.InnerRow>
              <S.Column>
                <S.Subtitle>Teste da cotação de fretes:</S.Subtitle>
                <S.InnerContainer>

                  <S.TestList>
                    <S.TestItem>Enviando request...</S.TestItem>
                    <S.TestItem>Response recebido</S.TestItem>
                    <S.TestItem>Response Status 200</S.TestItem>
                    <S.TestItem>Cotação bem sucedida</S.TestItem>
                    <S.TestItem>Valor da melhor cotação: </S.TestItem>
                    <S.TestItem>Normas de empacotamento: </S.TestItem>
                    <S.TestItem>Tempo estimado de viagem:</S.TestItem>
                    <S.TestItem>Compania:</S.TestItem>
                    <S.TestItem>Teste encerrado: {showTime(new Date())}</S.TestItem>
                  </S.TestList>
                </S.InnerContainer>
              </S.Column>
              <S.Column>
                <S.Anchor href={`https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=${credentials.client_id}&redirect_uri=${credentials.redirect_uri}&response_type=code&scope=shipping-calculate`} target="_blank">
                  <S.Btn>Repetir Teste</S.Btn>
                </S.Anchor>
              </S.Column>
            </S.InnerRow>
          </S.Column>
        </S.Row>

        <S.Row>
          <S.Column>
            <S.Subtitle>Access Token:</S.Subtitle>
            <S.InnerContainer>
              <S.Subtitle>{credentials.access_token}</S.Subtitle>
            </S.InnerContainer>
          </S.Column>

          <S.Column>
            <S.Subtitle>Refresh Token:</S.Subtitle>
            <S.InnerContainer>
              <S.Subtitle>{credentials.access_token}</S.Subtitle>
              {/* <S.Subtitle>{credentials.refresh_token}</S.Subtitle> */}
            </S.InnerContainer>
          </S.Column>

        </S.Row>

      </S.Container>
    </>
  );
};

export default memo(HomePage);
