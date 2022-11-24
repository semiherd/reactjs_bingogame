import React,{useEffect, useState} from 'react'
import './App.css'
import Grid from './components/Grid'
import { newWords } from "./functions/items";
import ActionButton from "./components/ActionButton";
import PickedItem from "./components/PickedItem";
import options from "./assets/options";
import Confetti from 'react-confetti'

const App= () => {
  const[bingo,setBingo]= useState({})
  const[hiddenIndex,setHiddenIndex]= useState({})
  const[pickedItem,setPickedItem]= useState()
  const[pickedList,setPickedList]= useState(options)

  function randomInteger(min, max) {
    const response= Math.floor(Math.random() * (max - min + 1)) + min ;
    return response
  }
 
  const newCellDataList = function () {
    const dataArray= newWords()
    let filteredOutInt=[]
    let hiddenIndexes=[]
    
    while (hiddenIndexes.length < 1) {
      const randomResponse= randomInteger(0,24); 
      if(!filteredOutInt.includes(randomResponse)){
        hiddenIndexes.push(randomResponse)
      }
    }
    setHiddenIndex(hiddenIndexes)

    return dataArray.map((obj,index) => {
      if(hiddenIndexes.includes(index))
        return { item: obj, picked: false, hidden: true, stamped: true };
      else
        return { item: obj, picked:false, hidden: false, stamped: false };
    });
  };

  const [dimensions, setDimensions] = useState(getDimensions());
  const [cellDataList, setCellDataList] = useState(newCellDataList);
  
  function getDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  } 

  async function checkBingoRC(ind) {
    let rowChecked=[]
    let colChecked=[]
    let rowResponse;
    let colResponse;
    let checkInd;
    let rowNr= Math.floor(ind/5)

    Promise.all(cellDataList.map(async (item,index) => {
      const itemRow= Math.floor(index/5)
      if(itemRow==rowNr && index!=ind){
        rowChecked.push(item)
      }
      
      for(let i=0;i<5;i++){
        if(rowNr>i){
          checkInd= ind - ((rowNr-i)*5);
          if(!colChecked.includes(checkInd)) colChecked.push(cellDataList[checkInd])
        }else if(rowNr<i && i<=cellDataList.length){
          checkInd= ind + ((i-rowNr)*5);
          if(!colChecked.includes(checkInd)) colChecked.push(cellDataList[checkInd])
        }     
      }

      const ColCount= colChecked?.filter(i=>i.stamped==true).length;    
      const RowCount= rowChecked?.filter(i=>i.stamped==true).length;   
      
      if(RowCount==rowChecked?.length) rowResponse=true
      else rowResponse=false
      
      if(ColCount==colChecked?.length) colResponse=true
      else colResponse=false

    }))
    return {row:rowResponse,col:colResponse}
  }

  async function checkBingoDiagonal (){
    try{

      let diagLRChecked=[]
      let diagRLChecked=[]

      let diagLRResponse;
      let diagRLResponse;

      const diagonalIndexesLR=[0,6,12,18,24];
      const diagonalIndexesRL=[4,8,12,16,20];
      
      cellDataList.map((item,index) => {
        if(diagonalIndexesLR.includes(index)){
          diagLRChecked.push(item)  
        }
        if(diagonalIndexesRL.includes(index)){
          diagRLChecked.push(item)  
        }
      },[])

      const DiagLRCount= diagLRChecked?.filter(i=>i.stamped==true).length; 
      if(DiagLRCount==diagonalIndexesLR?.length) diagLRResponse=true
      else diagLRResponse=false

      const DiagRLCount= diagRLChecked?.filter(i=>i.stamped==true).length; 
      if(DiagRLCount==diagonalIndexesRL?.length) diagLRResponse=true
      else diagRLResponse=false

      setBingo({...bingo,diagLR:diagLRResponse,diagRL:diagRLResponse})
    }catch(e){
      console.log(e)
    }
  }

  const setStamped = async (index, stamped) => {
    const bingoResponse= await checkBingoRC(index)
    setBingo({...bingo,...bingoResponse})

    setCellDataList(
      cellDataList.map((cellData, cellDataIndex) => {
        if (index === cellDataIndex) {
          return { ...cellData, stamped: stamped };
        } else {
          return cellData;
        }
      })
    );
    
  };

  const toggleStampedForIndex = function (index,stamped) {
    return () => {
      if(cellDataList[index].hidden==false){
        setStamped(index, !stamped);
      }
    };
  };

  const cellPropsList= cellDataList.map((cellData, index) => ({
    ...cellData,
    toggleStamped: toggleStampedForIndex(index, cellData.stamped),
  }));

  const setNewItem= () => {
    setCellDataList(newCellDataList());
  };

  const clearAllCells= () => {
    setCellDataList(
      cellDataList.map((cellData) => ({ ...cellData, picked:false, stamped: false }))
    );
  };

  const pickOption= () => {
    const randomPickedItem= Math.floor(Math.random() * pickedList.length)
    const itemTag= options.filter(i=>i.id==randomPickedItem)[0]
    let cellItem=[];
    cellDataList.map((cell,index)=>{
      if(randomPickedItem.toString()==cell.item.id.toString()) {
        cellItem.push({...cell,picked: true})
      }else{
        cellItem.push(cell)
      }
    });
    setCellDataList(cellItem);
    setPickedItem(itemTag);
    setPickedList(pickedList.filter(i=>i.id!=randomPickedItem)); 
  };

  useEffect(() => {
    if(pickedItem){
      const timer = setTimeout(() => {
        let cellItem=[];
        cellDataList.map((cell,index)=>{
          cellItem.push({...cell,picked: false})         
        });
        setCellDataList(cellItem);
        setPickedItem(null)
      }, 2000);
    }
  }, [pickedItem]);

  useEffect(() => {
    if(bingo.row || bingo.col || bingo.diagLR || bingo.diagLR){
      const timer = setTimeout(() => setBingo({row:false,col:false,diagLR:false,diagRL:false}), 8000);
    }
  }, [bingo]);

  useEffect(() => {
    function handleResize() {
      setDimensions(getDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    checkBingoDiagonal()
  },[cellDataList])

  return(
    <div className="App">
    <header className="App-header">
      <h1>Bingo Application</h1>
        <div className="App-actions">
          <ActionButton
            text="New card"
            onClick={setNewItem}
            activeDuration={100}
          />
          <ActionButton
            text="Clear"
            onClick={clearAllCells}
            activeDuration={100}
          />
          <ActionButton
            text="Simulate Random Pick"
            onClick={pickOption}
            activeDuration={100}
          />
        </div>
    </header>
    {pickedItem && <PickedItem data={pickedItem} /> }   
    
    {bingo.row  && <Confetti height={dimensions.height} width={dimensions.width} numberOfPieces={500}  />}
    {bingo.col && <Confetti height={dimensions.height} width={dimensions.width} numberOfPieces={500} />}
    {bingo.diagLR && <Confetti height={dimensions.height} width={dimensions.width} numberOfPieces={500} />}
    {bingo.diagRL && <Confetti height={dimensions.height} width={dimensions.width} numberOfPieces={500} />}
    
    <Grid data={cellPropsList} picked={pickedItem} />
  </div>
  )
}

export default App;