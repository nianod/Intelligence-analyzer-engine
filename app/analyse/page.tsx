"use client"

import { useState } from "react"

const Analyze = () => {

    const [liveLink, setLiveLink] = useState<string>("")
    const [repoUrl, setRepoUrl] = useState<string>('')
    const [tab, setTab] = useState<string>('repoUrl')

    const tabs = [
        { id: 1, label: "Live Link"},
        { id: 2, label: "Repository Url"}
    ]

    return(
        <div className="min-h-screen p-2">
           <div className="border border-amber-400">
              {tabs.map((tab) => (
                <div key={tab.id}>
                    <div>{tab.label}</div>
                </div>
              ))}
           </div>
        </div>
    )
}

export default Analyze