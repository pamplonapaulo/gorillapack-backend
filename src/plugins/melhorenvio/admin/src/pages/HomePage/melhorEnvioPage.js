/*
 *
 * HomePage Melhor Envio Plugin
 *
 */

import React, { useEffect, useState, memo } from 'react';
// import PropTypes from 'prop-types';
import * as S from './styles';
import { fetchCredentials, replaceTokens } from '../../utils/api';

import Brand from '../../components/Brand';

import { sendRequest, sortByLowestPrice } from '../../utils/testMelhorEnvio';

const HomePage = () => {

  const [credentials, setCredentials] = useState({})
  const [code, setCode] = useState(undefined)
  const [accessToken, setAccessToken] = useState(undefined)
  const [refreshToken, setRefreshToken] = useState(undefined)

  const [request, setRequest] = useState(undefined)
  const [response, setResponse] = useState(undefined)
  const [accessTokenAcepted, setAccessTokenAcepted] = useState(undefined)

  const [bestPrice, setBestPrice] = useState(undefined)
  const [packingRules, setPackingRules] = useState(undefined)
  const [deliveryTime, setDeliveryTime] = useState(undefined)
  const [cheapestCompany, setCheapestCompany] = useState(undefined)

  const [finished, setFinished] = useState(undefined)

  const [reFetch, setReFetch] = useState(false)

  useEffect(async () => {
    document.title = "Melhor Envio";
    const credents = await fetchCredentials();
    setCredentials(
      {
        ...credents[0]
      }
    );
  }, [reFetch]);

  useEffect(() => {
    setCredentials(
      {
        ...credentials,
        code
      }
    );
  }, [code]);

  useEffect(() => {
    setCredentials(
      {
        ...credentials,
        accessToken
      }
    );
  }, [accessToken]);

  useEffect(() => {
    setCredentials(
      {
        ...credentials,
        refreshToken
      }
    );
  }, [refreshToken]);

  // const handleBigTest = async () => {
  //   const testar = {
  //     access_token: 'PAULO',
  //     refresh_token: 'RIO'
  //   }
  //   try {
  //     const result = await replaceTokens(testar.access_token, testar.refresh_token);
  //     console.log(result)
  //     return setReFetch(!reFetch)
  //   } catch(err) {
  //     console.log(err)
  //     throw new Error(err.message, { cause: err });
  //   }
  // }

  const callRefreshToken = async () => {
    try {

      const response = await sendRequest(credentials, 'refresh_token')
      const result = await response.json()

      // https://docs.menv.io/#4e68946c-e4d5-4d2e-bddf-34e7d9c12fe3
      // Será retornado então um array contendo o tipo do token (Bearer), o tempo de expiração do novo token, o novo token de acesso e o novo refresh token (para futura atualização do token de acesso).

      // if status 200, then update all credential States
      const saved = await replaceTokens(result);
      if (saved) {
        setAccessToken(result.access_token)
        setRefreshToken(result.refresh_token)
      }
      // Eu não me lembro exatamente como esse objeto é retornado
      // Só poderemos testar quando tivermos novas credenciais válidas, após help do Rodrigo no formulário
      // Quando testarmos, será salvo direto em utils/api.js, pelo comando sendRequest(credentials, 'refresh_token') aqui acima.

      // Tudo renovado. Agora é só reiniciar os testes:
      return handleTest()
    } catch (err) {
      console.error(err.message)
      return handleErrors('refresh_token')
    }
  }

  const handleErrors = (err) => {
    if (err === 'shipping_calculate') {
      setAccessTokenAcepted(false)
      return callRefreshToken()
    }

    if (err === 'refresh_token') {
      // let user know he must fill the form: click RECADASTRAR button
      console.error('Melhor Envio Plugin is broken! You must manually register it again!')
      // return someKindOfAlert():
      // Alert message about the issue
      // Then regressive counter
      // And then instant redirect
    }
  }

  const handleSuccess = (res) => {
    setAccessTokenAcepted('válido')
    setResponse('recebida')
    const sorted = sortByLowestPrice(res.data)
    setBestPrice(sorted[0].currency + ' ' + sorted[0].price)
    setPackingRules(
      sorted[0].packages[0].dimensions.height + 'cm x ' +
      sorted[0].packages[0].dimensions.length + 'cm x ' +
      sorted[0].packages[0].dimensions.width + 'cm'
    )
    setDeliveryTime(sorted[0].delivery_time + ' dias')
    setCheapestCompany(sorted[0].company.name)
    setFinished(true)
  }

  const handleTest = async () => {
    setRequest(' enviada')
    try {
      const response = await sendRequest(credentials, 'shipping_calculate')
      const result = await response.json()
      return handleSuccess(result)
    } catch (err) {
      console.error(err.message)
      return handleErrors('shipping_calculate')
    }
  }

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
                    <S.TestItem hasPassed={request}>
                      Requisição:<S.Span>{!!request ? request : ''}</S.Span>
                    </S.TestItem>
                    <S.TestItem hasPassed={accessTokenAcepted}>
                      Access Token:<S.Span>{!!accessTokenAcepted ? accessTokenAcepted : ''}</S.Span>
                    </S.TestItem>
                    <S.TestItem hasPassed={refreshToken} skipped={accessTokenAcepted}>
                      Refresh Token:<S.Span>{
                        !!refreshToken ?
                          refreshToken :
                          accessTokenAcepted ?
                          'teste dispensado' :
                          ''
                        }</S.Span>
                    </S.TestItem>
                    <S.TestItem hasPassed={response}>
                      Response recebido:<S.Span>{!!response ? response : ''}</S.Span>
                    </S.TestItem>
                    <S.TestItem hasPassed={cheapestCompany}>
                      Transportadora:<S.Span>{!!cheapestCompany ? cheapestCompany : ''}</S.Span>
                    </S.TestItem>
                    <S.TestItem hasPassed={bestPrice}>
                      Valor da melhor cotação:<S.Span>{!!bestPrice ? bestPrice : ''}</S.Span>
                    </S.TestItem>
                    <S.TestItem hasPassed={packingRules}>
                      Empacotamento:<S.Span>{!!packingRules ? packingRules : ''}</S.Span>
                    </S.TestItem>
                    <S.TestItem hasPassed={deliveryTime}>
                      Tempo estimado de viagem:<S.Span>{!!deliveryTime ? deliveryTime : ''}</S.Span>
                    </S.TestItem>
                    <S.TestItem hasPassed={finished}>
                      Teste encerrado:<S.Span>{!!finished ? showTime(new Date()) : ''}</S.Span>
                    </S.TestItem>
                  </S.TestList>
                </S.InnerContainer>
              </S.Column>
              <S.Column>
                <S.Anchor onClick={handleTest}>
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
              <S.Token>{credentials.access_token}</S.Token>
            </S.InnerContainer>
          </S.Column>

          <S.Column>
            <S.Subtitle>Refresh Token:</S.Subtitle>
            <S.InnerContainer>
              <S.Token>{credentials.refresh_token}</S.Token>
            </S.InnerContainer>
          </S.Column>

        </S.Row>

      </S.Container>
    </>
  );
};

export default memo(HomePage);
