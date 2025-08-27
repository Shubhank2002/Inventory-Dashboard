import React, { Children, createContext, useContext, useState } from 'react'

export const Data=createContext()

const UserContext = ({children}) => {
    const [selected, setselected] = useState('')
    const [UserName, setUserName] = useState("")
    
  return (
    <div>
        <Data.Provider value={{selected,setselected,UserName,setUserName}}>
            {children}
        </Data.Provider>
    </div>
  )
}

export default UserContext
