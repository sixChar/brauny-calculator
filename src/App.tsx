import { useState, useRef, useEffect } from 'react'
import './App.css'


const DisplayCell = ({value, dot}:{value: string, dot:boolean}) => {

    const ON_COLOR = "#53bfb0";
    const OFF_COLOR = "#27333b"; //"#30404a";

    let numValue = Number(value);

    const topCell = numValue == 0 || 
                    (numValue >= 2 && numValue <= 3) || 
                    (numValue >= 5 && numValue <= 9) ||
                    value === "U" || 
                    value === "O" ||
                    value === "C";
    const midCell = (numValue >= 2 && numValue <= 6) ||
                    (numValue >= 8) ||
                    (value == "-") ||
                    value === "O" || value === "o" ||
                    value === "C" || value === "c";
    const botCell = (numValue != 1 && 
                    numValue != 4 && 
                    numValue != 7 && 
                    numValue <= 9) ||
                    value == "U" || value == "u" ||
                    value === "O" || value === "o" ||
                    value === "C" || value === "c";
    const leftTopCell = numValue == 0 || 
                        (numValue >= 4 && numValue != 7);
    const leftBotCell = (numValue % 2 == 0) && numValue != 4 ||
                        value == "U" || value == "u" ||
                        value === "O" || value === "o" ||
                        value === "C" || value === "c";
    const rightTopCell = numValue <= 4 ||
                         numValue >= 7;
    const rightBotCell = numValue != 2 && numValue <= 9 ||
                        value == "U" || value == "u" ||
                        value === "O" || value === "o";

    //width="25" height="50" 
    return (
        <svg width="100%" viewBox="0 0 1 2">
            <g transform="skewX(-10) translate(0.275 0) scale(0.8 1)">
                <g fill={leftTopCell ? ON_COLOR : OFF_COLOR} transform="translate(0 0.15) scale(0.9 0.9)">
                    <path d="M 0.1 0.1 L 0 0.2 L 0 0.8 L 0.1 0.9 L 0.2 0.8 L 0.2 0.2 z"/>
                </g>

                <g fill={leftBotCell ? ON_COLOR : OFF_COLOR} transform="translate(0 0.95) scale(0.9 0.9)">
                    <path d="M 0.1 0.1 L 0 0.2 L 0 0.8 L 0.1 0.9 L 0.2 0.8 L 0.2 0.2 z"/>
                </g>

                <g fill={rightTopCell ? ON_COLOR : OFF_COLOR} transform="translate(0.8 0.15) scale(0.9 0.9)">
                    <path d="M 0.1 0.1 L 0 0.2 L 0 0.8 L 0.1 0.9 L 0.2 0.8 L 0.2 0.2 z"/>
                </g>

                <g fill={rightBotCell ? ON_COLOR : OFF_COLOR} transform="translate(0.8 0.95) scale(0.9 0.9)">
                    <path d="M 0.1 0.1 L 0 0.2 L 0 0.8 L 0.1 0.9 L 0.2 0.8 L 0.2 0.2 z"/>
                </g>

                <g fill={topCell ? ON_COLOR : OFF_COLOR} transform="translate(0.95 0.1) rotate(90) scale(0.9 0.9)">
                    <path d="M 0.1 0.1 L 0 0.2 L 0 0.8 L 0.1 0.9 L 0.2 0.8 L 0.2 0.2 z"/>
                </g>
                <g fill={midCell ? ON_COLOR : OFF_COLOR} transform="translate(0.95 0.9) rotate(90) scale(0.9 0.9)">
                    <path d="M 0.1 0.1 L 0 0.2 L 0 0.8 L 0.1 0.9 L 0.2 0.8 L 0.2 0.2 z"/>
                </g>
                <g fill={botCell ? ON_COLOR : OFF_COLOR} transform="translate(0.95 1.7) rotate(90) scale(0.9 0.9)">
                    <path d="M 0.1 0.1 L 0 0.2 L 0 0.8 L 0.1 0.9 L 0.2 0.8 L 0.2 0.2 z"/>
                </g>
                <g fill={dot ? ON_COLOR : OFF_COLOR} transform="translate(1.05 1.7) scale(0.9 0.9)">
                    <rect rx="0.125" ry="0.125" x="0" y="0" width="0.25" height="0.25"/>
                </g>
                
            </g>
            
        </svg>
    );
}


interface ClockDisplayProps {
    displayText: string;
    displayMode: number;
    memory: string;
    overflow: boolean;
}
const ClockDisplay = ({displayText, displayMode, memory, overflow}:ClockDisplayProps) => {
    const maxDisplay = 10;
    let toDisplay = Array(maxDisplay);

    let text = displayText;

    switch (displayMode) {
      case 1:
        text = String(Math.round(Number(displayText)));
        break;
      case 2:
        text = String(Math.round((Number(displayText) + Number.EPSILON) * 100) / 100);
        break;
      default:
        text = String(displayText);
        
    }

    let isNegative = false;
    if (displayText[0] === '-') {
        toDisplay[0] = '-';
        isNegative = true;
        text = text.slice(1);
    } else {
        toDisplay[0] = '_';
    }

    if (overflow && memory === "0" && isNegative) {
      toDisplay[0] = "C";
    } else if (overflow && memory === "0") {
      toDisplay[0] = "c";
    } else if (overflow && memory !== "0" && isNegative) {
      toDisplay[0] = "O";
    } else if (overflow && memory !== "0") {
      toDisplay[0] = "o";
    } else if (memory !== "0" && isNegative) {
      toDisplay[0] = "U";
    } else if (memory !== "0") {
      toDisplay[0] = "u";
    }

    let dotPos = text.indexOf('.');
    if (dotPos !== -1) {
      text = text.slice(0, dotPos) + text.slice(dotPos+1)
    }

    if (text === "") {
        text = "0";
    }


    let i;
    for (i=0; i < text.length && i+1 < maxDisplay; i++) {
      toDisplay[i+1] = text[i];
    }
    for (; i+1 < maxDisplay; i++) {
      toDisplay[i+1] = "_";
    }

    return (<>
      {
        toDisplay.map((x, i)=>(
          <span key={i} style={{lineHeight: "100%"}}><DisplayCell value={x} dot={i==dotPos}/></span>
        ))
      }
    </>);
}

const GuideRow = ({text, symbol}:{text:string, symbol:string}) => {
  return (
    <div className="unselectable" style={{
      display:"flex",
      justifyContent: "space-between",
      color: "#8fd4e4",
    }}>
        {text} <span>{symbol}</span>
    </div>
  );
}

const DisplayGuide = () => {
  return (
    <div style={{
      fontSize: "0.6em",
    }}>
      <GuideRow text="MINUS" symbol={"\u2212"}/>
      <GuideRow text="M" symbol="U"/>
      <GuideRow text="X10^8" symbol="C"/>
      <GuideRow text="MX10^8" symbol="O"/>
    </div>
  );
    
}


interface LabeledPillButtonProps {
    btnId: string;
    btnFunc(): any;
    label: string;
    marginLeft?: string;
}
const LabeledPillButton = ({btnId, btnFunc, label, marginLeft}:LabeledPillButtonProps) => {
  const [pressed, setPressed] = useState(false);
  return (
    <div style={{
        height:"100%",
        width: "13.9%",
        display: "flex",
        flexDirection: "column",
        marginLeft: marginLeft
      }}
    >
      <label htmlFor={btnId} className="unselectable" style={{
        fontSize: "70%",
        fontWeight: "900",
        height: "27.9%",
      }}>
        {label}
      </label>
      <div 
        onMouseDown={()=>{
            setPressed(true);
            if (btnFunc) {btnFunc()};
        }} 
        onMouseUp={()=>setPressed(false)} 
        onMouseLeave={()=>setPressed(false)}
        id={btnId} 
        style={{
          background: "#291b18",
          width: "100%",
          height: "50%",
          marginTop: pressed ? '20%' : '15%',
          borderRadius: "10000px", //Force corners to be fully round on short side.
          overflow: "hidden",
          boxShadow: pressed ? "none" : "-3px 3px 6px black",
      }}>
        <div style={{
            position: "relative",
            background: "#41322f",
            width: "100%",
            height:"100%",
            marginTop: "-35%",
            top: "0",
            zIndex: "2",
            borderRadius: '10000px',
            boxShadow: '0px 5px 10px #41322f',
        }}/>
        <div style={{
            position: "relative",
            background: "radial-gradient(circle at left, white, transparent 15%)",
            width: "100%",
            height:"100%",
            top: "-50%",
            zIndex: "3",
            borderRadius: '10000px',
            opacity: '50%',
        }}/>
        <div style={{
            position: "relative",
            background: "radial-gradient(circle at right, white, transparent 10%)",
            width: "100%",
            height:"100%",
            top: "-150%",
            zIndex: "3",
            borderRadius: '10000px',
            opacity: '50%',
        }}/>
      </div>
    </div>
  );
}


const SelectSwitch = ({state, setState}:{state:number, setState:(value: number)=>void}) => {

  const trackRef = useRef<HTMLDivElement | null>(null);

  const handleDrag = (event:any) => {
    event.preventDefault();
    const bounds = trackRef.current?.getBoundingClientRect();
    const low = bounds ? bounds.x : 0;
    const width = bounds ? bounds.width : 0;


    let newState;
    if (event.clientX < low + width/4) {
        newState = 0;
    } else if (event.clientX < low + width * 3 / 4) {
        newState = 1;
    } else {
        newState = 2;
    }
    setState(newState);
  }

  const marginLeft = ((state == 0) && "-5%") || ((state == 1) && "27%") || "60%";
  return (
    <div 
      onClick={()=>{setState((state + 1) % 3)}}
      onDrag={handleDrag}
      onDragEnd={handleDrag}
      style={{
        width: "16.22%",
    }}>
      <div style={{
        height:"40%",
        display: "flex",
        justifyContent: "space-around"
      }}>
        <span className="unselectable">F</span>
        <span className="unselectable">0</span>
        <span className="unselectable">2</span>
      </div>
      {/* Slider Thumb */}
      <div 
        style={{
          position:"relative",
          width: "44.28%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          marginLeft: marginLeft,
          marginTop: "6.52%",
          zIndex: "3",
          overflow: "hidden",
          boxShadow: "0px 2px 5px black"
      }}>
        <div style={{
          position: "relative",
          background: "#291b18",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
        }}/>
        <div style={{
          position: "relative",
          background: "repeating-linear-gradient(90deg, #291b18 5%, #41322f 10%)",
          width: "100%",
          height: "100%",
          top: "-110%",
          borderRadius: "50%",
        }}/>
        
      </div>
    
      {/* Slider Track */}
      <div ref={trackRef} style={{
        position: "relative",
        background: "black",
        width:"80%",
        height: "40%",
        top: "-45%",
        marginLeft: "auto",
        marginRight: "auto",
        zIndex: "1",
        borderRadius: "10000px",
        overflow: "hidden",
      }}>
        <div style={{
          position: "relative",
          height: "100%",
          width: "100%",
          top: "0",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: "10000px",
          zIndex: "auto",
          background: "#211f22",
          boxShadow: "inset 0 0 10px black",
          
        }}></div>
      </div>
    </div>
  );
}


interface CircleButtonProps {
    text: string;
    onClick(): any;
    fontSize: string;
    color: number;
}
const CircleButton = ({text, onClick, fontSize, color}: CircleButtonProps) => {
  // Const inside to make components more self contained
  const CIRCLE_COLORS = ["#010101", "#302120", "#db893d"]
  const CIRCLE_FONT_COLORS = ["#ffffff", "#ffffff", "#010101"]

  const [pressed, setPressed] = useState(false);

  return (
    <div 
      onMouseDown={()=>{setPressed(true); onClick && onClick()}} 
      onMouseUp={()=>setPressed(false)} 
      onMouseLeave={()=>setPressed(false)}
      style={{
        position: "relative",
        borderRadius: "50%",
        overflow: "hidden",
        top: pressed ? "5%" : "0px",
        boxShadow: pressed ? "none" : "-3px 3px 6px black",
        background: CIRCLE_COLORS[color],
        color: CIRCLE_FONT_COLORS[color],
        fontSize: fontSize,
    }}>
      <div className="unselectable" style={{
        position: "relative",
        width:"100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>{text}</div>
      
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        top: "-100%",
        borderRadius: "50%",
        background: "linear-gradient(180deg, white, transparent 40%)",
        opacity: "20%",
      }}/>
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        top: "-222%",
        left: "-22%",
        borderRadius: "50%",
        background: "radial-gradient(circle at left, white 20%, transparent 30%)",
        opacity: "100%",
      }}/>
      <div style={{
        position: "relative",
        width: "120%",
        height: "120%",
        top: "-300%",
        left: "-15%",
        borderRadius: "50%",
        background: "transparent", //"radial-gradient(circle at right, white 20%, transparent 30%)",
        opacity: "50%",
        boxShadow: "inset 0 0 10px white",
      }}/>
      
      
    </div>
  );
}


function CircleButtonGrid({handleBtn}:{handleBtn:(text:string)=>void}) {
  const BTN_TEXT = [
    "\u221A", "7", "8", "9", "\u2797",
    "\u0025", "4", "5", "6", "\u2A2F",
    "CE", "1", "2", "3", "\u2796",
    "C", "0", "\u2022", "=", "+",
  ];

  return (
    <>
      {Array.from(BTN_TEXT, (text,i)=>{
        let color = 0;
        if (i % 5 == 0 || i % 5 == 4 || i == 17) {
            color = 1;
        } else if (i == 18) {
            color = 2;
        }

        return <CircleButton 
                    key={i}
                    text={text} 
                    color={color} 
                    fontSize={"130%"} 
                    onClick={()=>handleBtn(text)}
               />
      })}
    </>
  );
}


function App() {
  const hidState = useRef({currOp:"", buffer:"", shouldClear:false});

  const [display, setDisplay] = useState<string>("");
  const [displayMode, setDisplayMode] = useState<number>(0);
  const [memory, setMemory] = useState<string>("0");
  const [overflow, setOverflow] = useState<boolean>(false);

  const [holderDims, setHolderDims] = useState<number[]>([0,0]);

  const ASPECT_RATIO = 0.582;

  const MAX_DISPLAY = 9;
  const DIV_SYM = "\u2797";
  const MUL_SYM = "\u2A2F";
  const SUB_SYM = "\u2796";
  const ADD_SYM = "+";
  const DOT_SYM = "\u2022";
  const SQRT_SYM = "\u221A";
  const PCT_SYM = "\u0025";

  const updateHolderDims = () => {
    let height = window.innerHeight - 20;
    let width = window.innerWidth;

    if (width < height * ASPECT_RATIO) {
        height = width / ASPECT_RATIO;
    } else {
        width = height * ASPECT_RATIO;
    }

    setHolderDims([width, height]);
  }

  useEffect(()=>{
    updateHolderDims();
    window.addEventListener("resize", updateHolderDims);
    return ()=>window.removeEventListener("resize", updateHolderDims);
  }, []);


  const handleOp = () => {
    switch(hidState.current.currOp) {
      case DIV_SYM:
        hidState.current.buffer = String(Number(hidState.current.buffer) / Number(display));
        break;
      case MUL_SYM:
        hidState.current.buffer = String(Number(hidState.current.buffer) * Number(display));
        break;
      case SUB_SYM:
        hidState.current.buffer = String(Number(hidState.current.buffer) - Number(display));
        break;
      case ADD_SYM:
        hidState.current.buffer = String(Number(hidState.current.buffer) + Number(display));
        break;
      default:
    }
    if (Math.abs(Number(hidState.current.buffer)) > 10 ** 8) {
      setOverflow(true);
      hidState.current.buffer = String(Number(hidState.current.buffer) / (10**8));
    } else if (overflow && Number(hidState.current.buffer) < 1) {
      hidState.current.buffer = String(Number(hidState.current.buffer) * (10 ** 8));
      setOverflow(false);
    }
    let toKeep = MAX_DISPLAY+1;
    toKeep += Number(hidState.current.buffer.indexOf('.') !== -1);
    hidState.current.buffer = String(Number(hidState.current.buffer.slice(0, toKeep)));
  }

  const addCharToDisplay = (ch:string) => {
    if (ch !== DOT_SYM && display === "0") {
        setDisplay(ch);
    } else if (display.indexOf(".") === -1) {
        setDisplay(prevDisplay => prevDisplay.slice(0, MAX_DISPLAY-1) + ch);
    } else {
        setDisplay(prevDisplay => prevDisplay.slice(0, MAX_DISPLAY) + ch);
    }
  }
  
  const handleBtn = (btnText:string) => {
    if (hidState.current.shouldClear && btnText !== SQRT_SYM) {
      setDisplay("");
      hidState.current.shouldClear = false;
    }
    switch(btnText) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        addCharToDisplay(btnText);
        break;
      case "C":
        hidState.current.buffer = "";
        hidState.current.currOp = "";
        setDisplay("");
        setOverflow(false);
        break;
      case "CE":
        setDisplay((prevDisplay) => {
            return prevDisplay !== "" ? prevDisplay.slice(0,-1) : prevDisplay;
        });
        break;
      case DIV_SYM:
      case MUL_SYM:
      case SUB_SYM:
      case ADD_SYM:
        if (hidState.current.currOp === "") {
            hidState.current.buffer = display;
            hidState.current.currOp = btnText;
            setDisplay("");
        } else {
            handleOp();
            hidState.current.currOp = btnText;
            setDisplay(hidState.current.buffer);
        }
        hidState.current.shouldClear = true;
        break;
      case "=":
        handleOp();
        hidState.current.currOp = "";
        setDisplay(hidState.current.buffer);
        hidState.current.shouldClear = true;
        break;
      case DOT_SYM:
        setDisplay((prevDisplay) => {
          let newDisplay = prevDisplay === "" ? "0." : prevDisplay;
          if (newDisplay.indexOf(".") === -1) {
            newDisplay = newDisplay + ".";
          }
          return newDisplay;
        });
        break;
      case SQRT_SYM:
        const res = Math.sqrt(Number(display));
        if (res !== undefined && !isNaN(res)) {
          setDisplay(String(res));
          hidState.current.shouldClear = true;
        }
        break;
      case PCT_SYM:
        setDisplay(String(Number(display)/100.));
        break;
      default:
        console.log("NOT IMPLEMENTED!")
    }
  }

  const toggleSign = () => {
    setDisplay((prevDisplay)=>{
      if (prevDisplay !== "0" && prevDisplay !== "") {
        return prevDisplay[0] === '-' ? prevDisplay.slice(1) : '-' + prevDisplay;
      } else {
        return prevDisplay;
      }
    });
  }

  const clearMemory = () => {
    setMemory("0");
  }

  const recallMemory = () => {
    setDisplay(memory);
    hidState.current.shouldClear = true;
  }

  const addToMemory = () => {
    setMemory(prevMem => String(Number(prevMem) + Number(display)));
    setDisplay("")
  }

  const subFromMemory = () => {
    setMemory(prevMem => String(Number(prevMem) - Number(display)));
    setDisplay("")
  }

  return (
    <div style={{
      height: holderDims[1],
      fontSize: holderDims[0] / 29,
      padding: "0px",
      margin: "0px",
    }}>
      <div style={{
        height: "100%",
        aspectRatio: "52.58 / 100",
        background: "#192124",
        padding:"0px",
        margin: "0px",
        overflow: "hidden",
        borderRadius: "2vmin 2vmin 5vmin 5vmin",
        boxShadow: "10px 2px 10px #000",
      }}>
        {/* Name Box*/}
        <div style={{
            marginTop: "21.4%",
            marginLeft: "10.81%",
            width: "15%",
            height: "3.3%",
            fontSize: "0.7em",
            textAlign: "left"
        }}>
            EV<span style={{fontSize:"1.3em"}}>A</span>NS
        </div>

        {/* Big Box*/}
        <div style={{
            marginTop: "15.08%",
            marginLeft: "auto",
            marginRight: "auto",
            width: "89.29%",
            height: "33.14%",
            background:"#192124",
            boxShadow: "inset black 0 0 10px",
            padding: "10px",
        }}>
            {/* Display Box */}
            <div style={{
              width: "88.02%",
              height: "40.2%", 
              marginTop: "4.34%",
              marginLeft: "auto",
              marginRight: "auto",
              background: "#1a2225",
              boxShadow: "inset 0 0 10px black",
              display: "flex",
            }}>
              {/* Sign Box */}
              <div style={{
                width: "17.46%",
                height: "54.73%",
                marginLeft: "2.21%",
                marginTop: "8.44%",
                background: "#1a2225",
              }}>
                <DisplayGuide/>
              </div>

              {/* Main Display */}
              <div style={{
                width: "65.88%",
                height: "59.32%",
                marginLeft: "3.25%",
                marginTop: "6.88%",
                paddingLeft: "3%",
                paddingRight: "3%",
                background: "#151d20",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "inset 0 0 5px black",
              }}>
                <ClockDisplay 
                  displayText={display} 
                  displayMode={displayMode} 
                  memory={memory} 
                  overflow={overflow}
                /></div>
            </div>

            <div style={{
              background: "transparent",
              width: "86.53%",
              height: "17.32%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "4.79%",
              display: "flex",
              justifyContent: "space-between",
            }}>
              <SelectSwitch state={displayMode} setState={setDisplayMode}/>
              <LabeledPillButton label={"+/\u2012"} btnId="sign-btn" btnFunc={toggleSign}/>
            </div>

            <div style={{
              background: "transparent",
              width: "87.1%",
              height: "18.15%",
              marginTop: "5.24%",
              marginLeft: "auto",
              marginRight: "auto",
              display: "flex",
            }}>
              <LabeledPillButton label="M+=" btnId="mem-store-btn" btnFunc={addToMemory}/>
              <LabeledPillButton label={"M\u2012="} btnId="mem-store-btn" marginLeft="7.6%" btnFunc={subFromMemory}/>
              <LabeledPillButton label="RM" btnId="mem-store-btn" marginLeft="29.1%" btnFunc={recallMemory}/>
              <LabeledPillButton label="CM" btnId="mem-store-btn" marginLeft="7.7%" btnFunc={clearMemory}/>
            </div>
            
        </div>
        
        {/* Button holder */}
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr 1fr 1fr",
            gridRowGap: "4.79%",
            gridColumnGap: "2.6%",
            marginTop: "8.36%",
            marginRight: "auto",
            marginLeft: "auto",
            width: "79.2%",
            height: "33.46%",
            
        }}>
          <CircleButtonGrid 
            handleBtn={handleBtn}
          />
        </div>
        <div style={{
          position: "relative",
          width: "2%",
          height: "95%",
          top: "-94%",
          left: "0.5%",
          background: "linear-gradient(90deg, transparent, white 30%, transparent 90%)",
          mask: "linear-gradient(transparent, #fff 1%, #555 30%, transparent)",
          WebkitMask: "linear-gradient(transparent, #fff 1%, #555 30%, transparent)",
          borderRadius: "100px",
          opacity: "30%",
        }}></div>
        <div style={{
          position: "relative",
          width: "3%",
          height: "99%",
          top: "-188.5%",
          left: "97%",
          background: "linear-gradient(90deg, transparent, white 30%, transparent 90%)",
          mask: "linear-gradient(transparent, #fff 3%, #555 30%, transparent)",
          WebkitMask: "linear-gradient(transparent, #fff 3%, #555 30%, transparent)",
          borderRadius: "100px",
          opacity: "20%",
        }}></div>
        <div style={{
          position: "relative",
          width: "95%",
          height: "1.9%",
          top: "-289.5%",
          left: "2%",
          background: "linear-gradient(transparent, white 30%, transparent 90%)",
          mask: "linear-gradient(90deg, transparent, #fff 4%, #555 90%, transparent 99%)",
          WebkitMask: "linear-gradient(90deg, transparent, #fff 4%, #555 90%, transparent 99%)",
          borderRadius: "100px",
          opacity: "20%",
        }}></div>
        
      </div>


    </div>
  )
}

export default App
