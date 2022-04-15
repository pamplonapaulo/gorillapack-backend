import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const swing = keyframes`
  0% {
    transform: translateX(0%);
  }
  25% {
    transform: rotate(50%);
  }
  50% {
    transform: rotate(0%);
  }
  75% {
    transform: rotate(-50%);
  }
  100% {
    transform: rotate(0%);
  }
`

export const Title = styled.h1`
  margin: 56px;
  color: #a5a5ba;
  text-transform: uppercase;
`

export const Subtitle = styled.h5`
  margin: 0;
  color: #333740;
  word-break: break-all;
  font-size: 0.875rem;
  line-height: 1.43;
`

export const InnerContainer = styled.div`
  background: rgba(0,0,0,0.2);
  border-radius: 5px;
  display: table;
  margin: 0.5rem 0 0;
  min-height: 35px;
  padding: 0.5rem;
  width: fit-content;

  ${Subtitle} {
    display: table-cell;
    font-size: 0.75rem;
    vertical-align: middle;
  }
`

export const Token = styled.h5`
  color: #333740;
  display: table-cell;
  font-size: 0.75rem;
  line-height: 1.43;
  overflow: hidden;
  vertical-align: middle;
  word-break: break-all;
`

export const Span = styled.span`
  float: right;
`

export const TestList = styled.ul`
  list-style: none;
`

export const TestItem = styled.li`
  color: red;
  line-height: 2;
  font-size: 0.75rem;
  color: ${(p) =>
    p.hasPassed
      ? '#39FF14'
        : p.hasPassed === undefined
        ? 'rgba(204, 204, 204, 0.6)'
        : '#ff1818'};

  &:before {
    animation: ${spin} 1s linear infinite;
    animation-name: ${(p) => (p.hasPassed === undefined ? spin : 'none')};
    color: inherit;
    opacity: ${(p) => (p.skipped ? '0' : '1')};
    display: inline-block;
    margin-right: 0.6rem;
    margin-bottom: -1px;
    content: '${(p) =>
    p.hasPassed
      ? '\\2713'
        : p.hasPassed === undefined
        ? '\\22EF'
        : '\\00D7'}';
  }
`

export const Anchor = styled.a`
    margin: auto 0;
    text-decoration: none;
    width: fit-content;
`

export const Column = styled.div`
  flex-direction: column;
  width: calc(50% - calc(1.5rem/2));

  ${Anchor} {
    margin: unset;
  }
`

export const InnerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${Column}:nth-child(2) {
    display: flex;
    align-items: end;
  }
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  &&:nth-of-type(1) {
    border-bottom: #2f2f3c solid 1px;
    padding-bottom: 1.5rem;

    ${Column}:nth-child(1) {
      width: fit-content;
    }
    ${Column}:nth-child(2) ${InnerRow} ${Column}{
      width: 100%;

      ${InnerContainer} {
        width: 100%;
      }
    }
  }

  &&:last-of-type {
    margin-bottom: 0;

    ${InnerContainer} {
      display: block;
      overflow-y: scroll;
      /* max-height: 100px; */
      width: 100%;
      height: 100px;

      ${Subtitle} {
        font-size: 0.75rem;
      }

      &::-webkit-scrollbar {
        width: 6px;
        border: 2px solid transparent;
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none !important;
        border: 2px solid transparent;
       }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(255,255,255,0.2) !important;
        outline: none !important;
        border-radius: 5px;
        width: 3px !important;
        margin: 2px;
      }

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      }
    }
  }
`

export const Container = styled.section`
  background: #212134;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  margin: 56px;

  ${Subtitle} {
    color: #a5a5ba;
  }

  &&:nth-of-type(1) {
    background: transparent;
    padding: 0 1.5rem 0 0;
    margin: 0 1.5rem 0 37px;
  }

  &&:nth-of-type(2) {
    background: transparent;
    margin-top: 0;
    padding: 0;
    max-width: 60%;
    text-align: justify;

    ${Subtitle} {
      color: #ffffff;
      word-break: break-word;
      color: #a5a5ba;
      font-size: 1rem;
      line-height: 1.5;
      margin-bottom: 2rem;
      max-width: 1550px;
    }
  }
`

export const Wrap = styled.div`
  width: 80px;
  height: 70px;
  display: flex;
  justify-content: center;

  @media only screen and (min-width: 1024px) {
    width: 190px;
  }
`

export const Btn = styled.button`
  align-items: center;
  background: #7b79ff;
  border: 1px solid #7b79ff;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.33;
  margin: 0;
  outline: none;
  padding: 8px 16px;

  @media only screen and (min-width: 1024px) {

    &:hover {
      border: 1px solid #4945ff;
      background: #4945ff;
    }
  }
`
