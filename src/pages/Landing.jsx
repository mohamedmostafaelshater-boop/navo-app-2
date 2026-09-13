import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PLANS, TRIAL_DAYS } from "../lib/plans";

const bars = [38, 52, 45, 68, 60, 82, 95];

function HeroChart() {
  const [grown, setGrown] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={s.chartCard} ref={ref}>
      <div style={s.chartHead}>
        <span style={s.chartTitle}>صافي المبيعات</span>
        <span style={s.chartBadge}>+41% عن الشهر اللي فات</span>
      </div>
      <div style={s.chartBars}>
        {bars.map((v, i) => (
          <div key={i} style={s.barTrack}>
            <div
