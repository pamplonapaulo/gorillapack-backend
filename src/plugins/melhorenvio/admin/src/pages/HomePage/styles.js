import styled from 'styled-components'

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

export const TestList = styled.ul`
  list-style: none;
`

export const TestItem = styled.li`
  color: red;
  line-height: 1.43;
  font-size: 0.75rem;
`

export const Anchor = styled.a`
    margin: auto 0;
    text-decoration: none;
    width: fit-content;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  &&:nth-of-type(1) {
    border-bottom: #2f2f3c solid 1px;
    padding-bottom: 1.5rem;
  }

  &&:last-of-type {
    margin-bottom: 0;

    ${InnerContainer} {
      ${Subtitle} {
        font-size: 0.75rem;
      }
    }
  }
`

export const Column = styled.div`
  flex-direction: column;
  width: calc(50% - calc(1.5rem/2));

  ${Anchor} {
    margin: unset;
  }

  /* ${InnerRow} {
    ${Column} {
      background: red;
      display: flex;
      align-items: end;
    }
  } */
`

export const InnerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${Column}:nth-child(2) {
    display: flex;
    align-items: end;
  }

  &&:nth-child(1) ${Column}{
    /* background: #ff00ff; */
  }
`

export const Container = styled.section`
  background: #212134;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  margin: 56px;

  &&:nth-of-type(1) {
    margin-top: 0;
  }

  ${Subtitle} {
    color: #a5a5ba;
  }

  &&:nth-of-type(1) {
    background: transparent;
    padding: 0 1.5rem 0 0;
    margin: 1.5rem 1.5rem 0 37px;
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
  &&:last-of-type {
    margin-bottom: 0;
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
  cursor: pointer;
  display: flex;
  margin: 0;
  outline: none;
  padding: 8px 16px;

  font-weight: 600;
  color: #ffffff;
  font-size: 0.75rem;
  line-height: 1.33;

  @media only screen and (min-width: 1024px) {

    &:hover {
      border: 1px solid #4945ff;
      background: #4945ff;
    }
  }
`
