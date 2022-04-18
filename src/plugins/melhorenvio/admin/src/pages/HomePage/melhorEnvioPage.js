/*
 *
 * HomePage Melhor Envio Plugin
 *
 */

import React, { useEffect, useState, memo } from 'react';
// import PropTypes from 'prop-types';
import * as S from './styles';
import { fetchCredentials, updateCredentials } from '../../utils/api';

import Brand from '../../components/Brand';

import { sendRequest, sortByLowestPrice } from '../../utils/testMelhorEnvio';

const HomePage = () => {

  const [credentials, setCredentials] = useState({})
  const [authorization_code, setAuthorizationCode] = useState(undefined)
  const [access_token, setAccessToken] = useState(undefined)
  const [refresh_token, setRefreshToken] = useState(undefined)

  const [request, setRequest] = useState(undefined)
  const [response, setResponse] = useState(undefined)
  const [accessTokenAcepted, setAccessTokenAcepted] = useState(undefined)

  const [bestPrice, setBestPrice] = useState(undefined)
  const [packingRules, setPackingRules] = useState(undefined)
  const [deliveryTime, setDeliveryTime] = useState(undefined)
  const [cheapestCompany, setCheapestCompany] = useState(undefined)

  const [finished, setFinished] = useState(undefined)

  const [reFetch, setReFetch] = useState(false)

  useEffect(() => {
    document.title = "Melhor Envio";

    const href = '/admin/plugins/melhorenvio?code=def502002835de5d8d0b1d5818c31f12bdf6a526966569f42dd46406afb96a8261d24a89ede1c12fe73fe7e714399092eea6e488566dad408eb622e00b64d98da62de1fc8ffd5e02089355db78b2d3a3e88b0e295bf46ecb83d949190f7a230b444b59006a23d2eed9cead21a6af0dda21c4cbaf56492a9524f50cdd4fb79256ed8024c9078264e9c5bbdfda44c8afa709575f3b6c2bb6bd0c06c5a251b801dbd7dc3e0b515db0f3f5fb32968df5630c296eed071eae9a09f198302124327fe533669bad1090a1d5d7be3af58d191beda5ca3d433799f4c1c9408ffb6a69fdf7127aabb01e67a136558868527534c20a5ccab63c44bb69b75de386d13ece1dccd7bc73e8b7a221c2fa9303e3c66b87b280a4c3cc73bdf144eb6d30a179918f9e253dda8d2c64524b13a943f801a3e328c10fbee9aaab7f7a4f1913bb8e90021ad5267b2de7f30dc54702da52b1dcf84dda398261cfe2a1ab2b5e44637c3538d8b330630b1d82dbc4068654262479643ec8a990ef3d024dad4f1a1da01a76a0aca353048d0e59c8525a1814e35ea6e481511f96989a41a1633aeda55347fc9312702aa43746796874a337479662d17f39d6dee414c82d1aa64c39e4';
    //watchPathname(href)
    watchPathname(window.location.href)
  },[])

  useEffect(async () => {
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
        authorization_code
      }
    );
  }, [authorization_code]);

  useEffect(() => {
    setCredentials(
      {
        ...credentials,
        access_token
      }
    );
  }, [access_token]);

  useEffect(() => {
    setCredentials(
      {
        ...credentials,
        refresh_token
      }
    );
  }, [refresh_token]);

  const filterTypes = (arr) => {
    if (arr.length === 2 && arr.filter(value => value === 'access_token')) return ['shipping_calculate']
    if (arr.length === 1) return arr
  }

  const handleSave = async (obj) => {

    console.log('handle save.......')
    console.log(Object.getOwnPropertyNames(obj))
    console.log(obj)

    console.log('and next melhor envio:')
    console.log(filterTypes(Object.getOwnPropertyNames(obj)))

    try {
      const response = await updateCredentials(obj);
      const result = await response.json()
      console.log('updated credentials:')
      console.log(result)

      setReFetch(!reFetch)
      return callMelhorEnvio(
        {
          ...credentials,
          ...obj
        },
        filterTypes(Object.getOwnPropertyNames(obj))
      )
    } catch(err) {
      console.error(err)
      handleErrors('update_credentials')
      throw new Error(err.message, { cause: err });
    }
  }

  const watchPathname = (path) => {
    const regex = /(\?|\&)([^=]+)\=([^&]+)/g;
    const params = [...path.matchAll(regex)];

    if (params.length > 0 && params[0][2] === 'code') {
      return handleSave({ authorization_code: params[0][3] })
    }
  }

  const callMelhorEnvio = async (creds, type) => {
    setRequest(type[0])

    try {
      const response = await sendRequest(creds, type[0])
      const result = await response.json()
      console.log(result)
      return type[0] === 'shipping_calculate' ? handleSuccess(result) : handleSave(result)
    } catch(err) {
      console.error(err)
      handleErrors(type[0])
      throw new Error(err.message, { cause: err });
    }
  }

  const handleErrors = (err) => {
    if (err === 'shipping_calculate') {
      setAccessTokenAcepted(false)
      return callMelhorEnvio(credentials, ['refresh_token'])
    }

    if (err === 'refresh_token') {
      setRefreshToken(false)
      setResponse(false)
      setCheapestCompany(false)
      setBestPrice(false)
      setPackingRules(false)
      setDeliveryTime(false)
      setFinished(true)
      console.error('You must manually register the plugin again. Click on the button to open Melhor Envio\'s from.')
    }

    if (err === 'authorization_code') {
      setCodeAcepted(false)
      console.error('You must call the suppor!')
      // return callFatalError()
    }

    if (err === 'update_credentials') {
      console.error('Credentials not saved on Strapi')
    }
  }

  const handleSuccess = (res) => {
    setAccessTokenAcepted('válido')
    setResponse('recebida')
    setCheapestCompany(sorted[0].company.name)
    const sorted = sortByLowestPrice(res.data)
    setBestPrice(sorted[0].currency + ' ' + sorted[0].price)
    setPackingRules(
      sorted[0].packages[0].dimensions.height + 'cm x ' +
      sorted[0].packages[0].dimensions.length + 'cm x ' +
      sorted[0].packages[0].dimensions.width + 'cm'
    )
    setDeliveryTime(sorted[0].delivery_time + ' dias')
    setFinished(true)
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
                    <S.TestItem hasPassed={refresh_token} skipped={accessTokenAcepted}>
                      Refresh Token:<S.Span>{
                        !!refresh_token ?
                          refresh_token :
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
                <S.Anchor onClick={() => callMelhorEnvio(credentials, ['shipping_calculate'])}>
                  <S.Btn>Testar</S.Btn>
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
