import {useEffect,useState} from "react"
export function usePrefersReducedMotion(){const [reduced,setReduced]=useState(false);useEffect(()=>{const q=window.matchMedia("(prefers-reduced-motion: reduce)"),u=()=>setReduced(q.matches);u();q.addEventListener("change",u);return()=>q.removeEventListener("change",u)},[]);return reduced}
