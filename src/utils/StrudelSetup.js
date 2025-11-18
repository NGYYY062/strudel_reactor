import { useEffect, useRef, useState } from "react";

export function GetAllTags({ inputText }) {
    // initial copy
    if (!inputText) return new Set();

    const code = inputText;
    const tags = [...code.matchAll(/<([a-zA-Z][^<>\s]*)>/g)].map(m => m[0]);
    console.log(tags);
    const uniqueTags = Array.from(new Set(tags));
    return uniqueTags;
}

export function UpdateCurrentTags({ inputText, tagDict }) {
    const tags = GetAllTags({ inputText: inputText }) || [];
    let tempDict = { ...tagDict };

    console.log("From UpdateCurrentTags:");
    console.log(tags);

    tags.forEach(tag => {
        if (!(tag in tempDict)) {
            tempDict[tag] = 0;
        }
    });

    Object.keys(tempDict).forEach((key) => {
        if (!tags.includes(key)) {
            delete tempDict[key];
        }
    });

    console.log(tempDict);

    return tempDict;
}

export function UpdateTagVals({ tagDict, key, val }) {
    let tempDict = { ...tagDict };
    tempDict[key] = val;

    return tempDict;
}