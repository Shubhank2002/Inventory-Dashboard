import React, { Children, createContext, useContext, useState } from 'react'

export const Data=createContext()

const UserContext = ({children}) => {
    const [selected, setselected] = useState('')
    
  return (
    <div>
        <Data.Provider value={{selected,setselected}}>
            {children}
        </Data.Provider>
    </div>
  )
}

export default UserContext
