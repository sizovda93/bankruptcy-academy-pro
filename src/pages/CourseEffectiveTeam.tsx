import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { Award, BookOpenCheck, Files, Minus, Plus, ShieldCheck, Sparkles, Users, Target, Settings, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormContent } from "@/components/LeadFormSection";
import CourseInstallmentBlock from "@/components/course/CourseInstallmentBlock";
import { api, StudentCase, Teacher } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const highlights = [
  "РћСЂРіСЃС‚СЂСѓРєС‚СѓСЂР° Рё СЂРѕР»Рё РїРѕРґ СЂР°Р·РЅС‹Р№ СЂР°Р·РјРµСЂ РєРѕРјР°РЅРґС‹ (3/7/15/30 С‡РµР»РѕРІРµРє)",
  "KPI Рё РјРѕС‚РёРІР°С†РёСЏ, РєРѕС‚РѕСЂС‹Рµ СЂР°Р±РѕС‚Р°СЋС‚ Р±РµР· С‚РѕРєСЃРёС‡РЅРѕСЃС‚Рё",
  "РЎРёСЃС‚РµРјР° РЅР°Р№РјР°, Р°РґР°РїС‚Р°С†РёРё Рё РєРѕРЅС‚СЂРѕР»СЏ РєР°С‡РµСЃС‚РІР° РєР°Рє РєРѕРЅРІРµР№РµСЂ",
];

const audience = [
  "Р СѓРєРѕРІРѕРґРёС‚РµР»СЏРј-РѕРґРёРЅРѕС‡РєР°Рј, РєРѕС‚РѕСЂС‹Рµ РЅР°РЅРёРјР°СЋС‚ РїРµСЂРІС‹С… СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ Рё С…РѕС‚СЏС‚, С‡С‚РѕР±С‹ РѕРЅРё РїСЂРёРЅРѕСЃРёР»Рё СЂРµР·СѓР»СЊС‚Р°С‚ Р±РµР· РїРѕСЃС‚РѕСЏРЅРЅРѕРіРѕ РЅР°РґР·РѕСЂР°.",
  "Р’Р»Р°РґРµР»СЊС†Р°Рј РєРѕРјР°РЅРґ 4вЂ“10 С‡РµР»РѕРІРµРє СЃ С…Р°РѕСЃРѕРј РІ Р·Р°РґР°С‡Р°С…, СЃСЂС‹РІР°РјРё СЃСЂРѕРєРѕРІ Рё РЅРµРѕР±С…РѕРґРёРјРѕСЃС‚СЊСЋ РІСЃС‘ С‚Р°С‰РёС‚СЊ РЅР° СЃРµР±Рµ.",
  "Р СѓРєРѕРІРѕРґРёС‚РµР»СЏРј РєРѕРјР°РЅРґ 10вЂ“30+ С‡РµР»РѕРІРµРє, РєРѕС‚РѕСЂС‹Рј РЅСѓР¶РЅС‹ СѓРїСЂР°РІР»РµРЅС‡РµСЃРєРёРµ СѓСЂРѕРІРЅРё, СЃРёСЃС‚РµРјР° РЅР°Р№РјР°, KPI Рё РѕС‚РґРµР»С‹.",
  "РЎРѕР±СЃС‚РІРµРЅРЅРёРєР°Рј СЋСЂРёРґРёС‡РµСЃРєРёС… РєРѕРјРїР°РЅРёР№ РІ СЃС„РµСЂРµ Р‘Р¤Р› Рё СЃРјРµР¶РЅС‹С… СѓСЃР»СѓРі, РіРґРµ РєСЂРёС‚РёС‡РЅС‹ СЃСЂРѕРєРё, РєР°С‡РµСЃС‚РІРѕ Рё РјР°СЃСЃРѕРІРѕРµ РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ.",
];

const lessons = [
  {
    title: "РњРѕРґСѓР»СЊ 1. Р”РёР°РіРЅРѕСЃС‚РёРєР° РєРѕРјР°РЅРґС‹ Рё С‚РѕС‡РєР° В«РђВ»",
    points: [
      "РџРѕС‡РµРјСѓ В«Р»СЋРґРµР№ РјРЅРѕРіРѕ вЂ” СЂРµР·СѓР»СЊС‚Р°С‚Р° РјР°Р»РѕВ»",
      "Р“РґРµ С‚РµСЂСЏРµС‚СЃСЏ СЌС„С„РµРєС‚РёРІРЅРѕСЃС‚СЊ: СЂРѕР»Рё, РїСЂРѕС†РµСЃСЃС‹, РєРѕРЅС‚СЂРѕР»СЊ, РјРѕС‚РёРІР°С†РёСЏ",
      "Р”РёР°РіРЅРѕСЃС‚РёРєР°: СЃРєРѕСЂРѕСЃС‚СЊ, РєР°С‡РµСЃС‚РІРѕ, Р·Р°РіСЂСѓР·РєР°, СѓР·РєРёРµ РјРµСЃС‚Р°",
      "РљР°СЂС‚Р° РїСЂРѕР±Р»РµРј: В«РѕРїРµСЂР°С†РёРѕРЅРєР° СЃСЉРµР»Р° СЂСѓРєРѕРІРѕРґРёС‚РµР»СЏВ»",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 2. Р РѕР»Рё Рё РѕСЂРіСЃС‚СЂСѓРєС‚СѓСЂР° (СЃРєРµР»РµС‚ СѓРїСЂР°РІР»РµРЅРёСЏ)",
    points: [
      "РћСЂРіСЃС‚СЂСѓРєС‚СѓСЂР° РґР»СЏ РєРѕРјР°РЅРґС‹ 3/7/15/30 С‡РµР»РѕРІРµРє",
      "Р РѕР»Рё РІ СЋСЂ. Р±РёР·РЅРµСЃРµ: РїСЂРѕРґР°Р¶Рё, Р°СѓРґРёС‚/РєРѕРЅСЃСѓР»СЊС‚Р°С†РёРё, РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ, СЃРµСЂРІРёСЃ, СЋСЂРєРѕРЅС‚СЂРѕР»СЊ, РґРѕРєСѓРјРµРЅС‚РѕРѕР±РѕСЂРѕС‚",
      "Р—РѕРЅС‹ РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚Рё (RACI): РєС‚Рѕ РґРµР»Р°РµС‚, РєС‚Рѕ СЃРѕРіР»Р°СЃСѓРµС‚, РєС‚Рѕ РѕС‚РІРµС‡Р°РµС‚",
      "РљР°Рє РЅРµ РґРѕРїСѓСЃРєР°С‚СЊ В«РґРІРѕР№РЅРѕР№ РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚РёВ» Рё В«Р±РµР·РѕС‚РІРµС‚СЃС‚РІРµРЅРЅС‹С… Р·Р°РґР°С‡В»",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 3. РџСЂРѕС†РµСЃСЃС‹ Рё СЂРµРіР»Р°РјРµРЅС‚С‹: С‡С‚РѕР±С‹ Р±С‹Р»Рѕ РїРѕРІС‚РѕСЂСЏРµРјРѕ",
    points: [
      "РљР°РєРёРµ РїСЂРѕС†РµСЃСЃС‹ РЅСѓР¶РЅРѕ Р·Р°С„РёРєСЃРёСЂРѕРІР°С‚СЊ РїРµСЂРІС‹РјРё",
      "Р РµРіР»Р°РјРµРЅС‚ РєР°Рє РёРЅСЃС‚СЂСѓРјРµРЅС‚ СЃРІРѕР±РѕРґС‹, Р° РЅРµ Р±СЋСЂРѕРєСЂР°С‚РёРё",
      "Р§РµРє-Р»РёСЃС‚С‹ РїРѕ СЌС‚Р°РїР°Рј РїСЂРѕРёР·РІРѕРґСЃС‚РІР° РІ Р‘Р¤Р›: Р°РЅРєРµС‚Р° в†’ Р°СѓРґРёС‚ в†’ РґРѕРіРѕРІРѕСЂ в†’ РґРѕРєСѓРјРµРЅС‚С‹ в†’ СЃСѓРґ в†’ РїСЂРѕС†РµРґСѓСЂР°",
      "РЁР°Р±Р»РѕРЅС‹ РєРѕРјРјСѓРЅРёРєР°С†РёРё РІРЅСѓС‚СЂРё РєРѕРјР°РЅРґС‹ Рё СЃ РєР»РёРµРЅС‚Р°РјРё",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 4. РџРѕСЃС‚Р°РЅРѕРІРєР° Р·Р°РґР°С‡ Рё СѓРїСЂР°РІР»РµРЅРёРµ РёСЃРїРѕР»РЅРµРЅРёРµРј",
    points: [
      "РљР°Рє СЃС‚Р°РІРёС‚СЊ Р·Р°РґР°С‡Сѓ, С‡С‚РѕР±С‹ РµС‘ РЅРµ В«РїРµСЂРµРїРѕРЅСЏР»РёВ»",
      "РЎС‚Р°РЅРґР°СЂС‚С‹: В«С‡С‚Рѕ С‚Р°РєРѕРµ С…РѕСЂРѕС€Рѕ СЃРґРµР»Р°РЅРѕВ»",
      "РЎРёСЃС‚РµРјР° СЃС‚Р°С‚СѓСЃРѕРІ: РѕС‡РµСЂРµРґСЊ/РІ СЂР°Р±РѕС‚Рµ/РїСЂРѕРІРµСЂРєР°/РіРѕС‚РѕРІРѕ",
      "Р”РµРґР»Р°Р№РЅС‹, SLA, РєРѕРЅС‚СЂРѕР»СЊ В«Р±РµР· РјРёРєСЂРѕРјРµРЅРµРґР¶РјРµРЅС‚Р°В»",
      "Р•Р¶РµРґРЅРµРІРЅС‹Рµ/РµР¶РµРЅРµРґРµР»СЊРЅС‹Рµ СЂРёС‚РјС‹: РїР»Р°РЅС‘СЂРєРё, РѕС‚С‡С‘С‚РЅРѕСЃС‚СЊ, СЂРµС‚СЂРѕ",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 5. KPI Рё РјРµС‚СЂРёРєРё СЌС„С„РµРєС‚РёРІРЅРѕСЃС‚Рё",
    points: [
      "KPI РїРѕ СЂРѕР»СЏРј: РїСЂРѕРґР°Р¶Рё, РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ, СЃРµСЂРІРёСЃ",
      "Р‘Р°Р»Р°РЅСЃ В«СЃРєРѕСЂРѕСЃС‚СЊвЂ“РєР°С‡РµСЃС‚РІРѕвЂ“СѓРґРѕРІР»РµС‚РІРѕСЂРµРЅРЅРѕСЃС‚СЊ РєР»РёРµРЅС‚Р°В»",
      "РњРµС‚СЂРёРєРё: РєРѕРЅРІРµСЂСЃРёСЏ, СЃСЂРѕРє С†РёРєР»Р°, РїСЂРѕСЃСЂРѕС‡РєРё, РѕС€РёР±РєРё, NPS, РїРѕРІС‚РѕСЂРЅС‹Рµ РѕР±СЂР°С‰РµРЅРёСЏ",
      "РљР°Рє СЃС‡РёС‚Р°С‚СЊ Рё РєР°Рє РІРЅРµРґСЂСЏС‚СЊ Р±РµР· СЃРѕРїСЂРѕС‚РёРІР»РµРЅРёСЏ",
      "РЈРїСЂР°РІР»РµРЅС‡РµСЃРєРёР№ РґР°С€Р±РѕСЂРґ СЂСѓРєРѕРІРѕРґРёС‚РµР»СЏ",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 6. РњРѕС‚РёРІР°С†РёСЏ: РґРµРЅСЊРіРё + СЃРјС‹СЃР»С‹ + РїСЂР°РІРёР»Р°",
    points: [
      "Р¤РёРєСЃ/Р±РѕРЅСѓСЃ/РіСЂРµР№РґС‹/РїСЂРµРјРёРё Р·Р° РєР°С‡РµСЃС‚РІРѕ",
      "РњРѕС‚РёРІР°С†РёСЏ, РєРѕС‚РѕСЂР°СЏ РЅРµ СѓР±РёРІР°РµС‚ РёРЅРёС†РёР°С‚РёРІСѓ",
      "РЎРёСЃС‚РµРјР° С€С‚СЂР°С„РѕРІ: РєРѕРіРґР° РґРѕРїСѓСЃС‚РёРјР°, РєРѕРіРґР° СЂР°Р·СЂСѓС€Р°РµС‚",
      "РќРµРјР°С‚РµСЂРёР°Р»СЊРЅР°СЏ РјРѕС‚РёРІР°С†РёСЏ: РїСЂРёР·РЅР°РЅРёРµ, СЂРѕСЃС‚, СЂРѕР»СЊ, Р°РІС‚РѕРЅРѕРјРЅРѕСЃС‚СЊ",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 7. РќР°Р№Рј В«РїРѕРґ СЂРµР·СѓР»СЊС‚Р°С‚В»",
    points: [
      "РџРѕСЂС‚СЂРµС‚С‹ РєР°РЅРґРёРґР°С‚РѕРІ РЅР° РєР»СЋС‡РµРІС‹Рµ СЂРѕР»Рё",
      "Р’РѕСЂРѕРЅРєР° РЅР°Р№РјР°: РіРґРµ РёСЃРєР°С‚СЊ Рё РєР°Рє С„РёР»СЊС‚СЂРѕРІР°С‚СЊ",
      "Р’РѕРїСЂРѕСЃС‹ РЅР° СЃРѕР±РµСЃРµРґРѕРІР°РЅРёРё, РєРѕС‚РѕСЂС‹Рµ СЂРµР°Р»СЊРЅРѕ СЂР°СЃРєСЂС‹РІР°СЋС‚ РєР°РЅРґРёРґР°С‚Р°",
      "РўРµСЃС‚РѕРІС‹Рµ Р·Р°РґР°РЅРёСЏ (РїСЂРѕСЃС‚С‹Рµ, РЅРѕ РїРѕРєР°Р·Р°С‚РµР»СЊРЅС‹Рµ)",
      "3 РєСЂР°СЃРЅС‹С… С„Р»Р°РіР°: С‚РѕРєСЃРёС‡РЅРѕСЃС‚СЊ, Р±РµР·РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚СЊ, В«СЏ РЅРµ РїСЂРѕ РїСЂР°РІРёР»Р°В»",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 8. РђРґР°РїС‚Р°С†РёСЏ Рё РѕР±СѓС‡РµРЅРёРµ",
    points: [
      "РџР»Р°РЅ Р°РґР°РїС‚Р°С†РёРё РЅР° 7/14/30 РґРЅРµР№",
      "В«РљРЅРёРіР° СЃРѕС‚СЂСѓРґРЅРёРєР°В»: РїСЂР°РІРёР»Р°, СЂРµРіР»Р°РјРµРЅС‚С‹, СЃС‚Р°РЅРґР°СЂС‚С‹",
      "РќР°СЃС‚Р°РІРЅРёС‡РµСЃС‚РІРѕ Рё РєРѕРЅС‚СЂРѕР»СЊ",
      "РџСЂРѕРІРµСЂРєР° РїРѕРЅРёРјР°РЅРёСЏ: РјРёРЅРё-СЌРєР·Р°РјРµРЅС‹/РїСЂР°РєС‚РёРєР°",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 9. РљРѕРЅС‚СЂРѕР»СЊ РєР°С‡РµСЃС‚РІР° Рё СЂР°Р·Р±РѕСЂ РѕС€РёР±РѕРє",
    points: [
      "Р§С‚Рѕ РєРѕРЅС‚СЂРѕР»РёСЂРѕРІР°С‚СЊ, Р° С‡С‚Рѕ РґРѕРІРµСЂРёС‚СЊ",
      "РљРѕРЅС‚СЂРѕР»СЊ РєР°С‡РµСЃС‚РІР° РґРѕРєСѓРјРµРЅС‚РѕРІ/РєРѕРјРјСѓРЅРёРєР°С†РёР№/СЃСЂРѕРєРѕРІ",
      "Р Р°Р±РѕС‚Р° СЃ РѕС€РёР±РєР°РјРё: СЂР°Р·Р±РѕСЂ Р±РµР· В«РІРёРЅРѕРІР°С‚С‹С…В», РЅРѕ СЃ РІС‹РІРѕРґР°РјРё",
      "РљР°Рє РїСЂРµРґРѕС‚РІСЂР°С‰Р°С‚СЊ РїРѕРІС‚РѕСЂРµРЅРёРµ РѕС€РёР±РѕРє (РѕР±РЅРѕРІР»РµРЅРёРµ СЂРµРіР»Р°РјРµРЅС‚РѕРІ)",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 10. РљРѕРјРјСѓРЅРёРєР°С†РёРё РІРЅСѓС‚СЂРё РєРѕРјР°РЅРґС‹",
    points: [
      "РљРѕРЅС„Р»РёРєС‚С‹: РїСЂРёС‡РёРЅС‹ Рё СЃС†РµРЅР°СЂРёРё СЂРµС€РµРЅРёСЏ",
      "Р“СЂР°РЅРёС†С‹ РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚Рё Рё В«РєС‚Рѕ РєРѕРјСѓ РґРѕР»Р¶РµРЅВ»",
      "РљСѓР»СЊС‚СѓСЂР° РѕР±СЂР°С‚РЅРѕР№ СЃРІСЏР·Рё: РєР°Рє РіРѕРІРѕСЂРёС‚СЊ, С‡С‚РѕР±С‹ СѓР»СѓС‡С€Р°Р»РѕСЃСЊ, Р° РЅРµ СЂР°Р·СЂСѓС€Р°Р»РѕСЃСЊ",
      "В«Р•РґРёРЅР°СЏ РёРЅС„РѕР»РёРЅРёСЏВ» РґР»СЏ РєР»РёРµРЅС‚Р°: РЅРёРєС‚Рѕ РЅРµ РіРѕРІРѕСЂРёС‚ СЂР°Р·РЅРѕРµ",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 11. РЈРїСЂР°РІР»РµРЅС‡РµСЃРєРёР№ СѓСЂРѕРІРµРЅСЊ",
    points: [
      "РљРѕРіРґР° РЅСѓР¶РµРЅ С‚РёРјР»РёРґ",
      "РљР°Рє РґРµР»РµРіРёСЂРѕРІР°С‚СЊ Р±РµР· РїРѕС‚РµСЂРё РєРѕРЅС‚СЂРѕР»СЏ",
      "РЎРёСЃС‚РµРјР° РѕС‚С‡С‘С‚РЅРѕСЃС‚Рё СЂСѓРєРѕРІРѕРґРёС‚РµР»РµР№",
      "РљР°Рє РІС‹СЂР°С‰РёРІР°С‚СЊ СѓРїСЂР°РІР»РµРЅС†РµРІ РІРЅСѓС‚СЂРё РєРѕРјР°РЅРґС‹",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 12. РђРЅС‚РёРєСЂРёР·РёСЃ: С‡С‚Рѕ РґРµР»Р°С‚СЊ, РєРѕРіРґР° РІСЃС‘ РіРѕСЂРёС‚",
    points: [
      "РЎСЂС‹РІ СЃСЂРѕРєРѕРІ, С‚РµРєСѓС‡РєР°, РїР°РґРµРЅРёРµ РєР°С‡РµСЃС‚РІР°",
      "В«РџРѕР¶Р°СЂРЅС‹Р№В» СЂРµР¶РёРј РЅР° 2 РЅРµРґРµР»Рё: СЃС‚Р°Р±РёР»РёР·Р°С†РёСЏ",
      "Р’РѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёРµ СЃС‚Р°РЅРґР°СЂС‚РѕРІ Рё РґРѕРІРµСЂРёСЏ РєР»РёРµРЅС‚РѕРІ",
      "РџР»Р°РЅ РїСЂРµРґРѕС‚РІСЂР°С‰РµРЅРёСЏ РїРѕРІС‚РѕСЂРµРЅРёСЏ РєСЂРёР·РёСЃР°",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 13. РљРѕРјР°РЅРґР° РєР°Рє Р°РєС‚РёРІ",
    points: [
      "РљР°Рє СѓРґРµСЂР¶РёРІР°С‚СЊ СЃРёР»СЊРЅС‹С…",
      "Р“СЂРµР№РґС‹ Рё РєР°СЂСЊРµСЂРЅС‹Рµ С‚СЂРµРєРё",
      "РљР°РґСЂРѕРІС‹Р№ СЂРµР·РµСЂРІ",
      "РљСѓР»СЊС‚СѓСЂР° В«РјС‹ РґРµР»Р°РµРј СЂРµР·СѓР»СЊС‚Р°С‚В» (РЅРµ В«РјС‹ РїСЂРѕСЃС‚Рѕ СЂР°Р±РѕС‚Р°РµРјВ»)",
    ],
  },
  {
    title: "РњРѕРґСѓР»СЊ 14. РС‚РѕРі: СЃР±РѕСЂРєР° РІР°С€РµР№ СЃРёСЃС‚РµРјС‹",
    points: [
      "РћСЂРіСЃС‚СЂСѓРєС‚СѓСЂР° + СЂРѕР»Рё + KPI",
      "Р РµРіР»Р°РјРµРЅС‚С‹ РїРѕ РєР»СЋС‡РµРІС‹Рј РїСЂРѕС†РµСЃСЃР°Рј",
      "РќР°Р№Рј Рё Р°РґР°РїС‚Р°С†РёСЏ",
      "Р РёС‚РјС‹ СѓРїСЂР°РІР»РµРЅРёСЏ",
      "РџР»Р°РЅ РІРЅРµРґСЂРµРЅРёСЏ РЅР° 30 РґРЅРµР№",
    ],
  },
];

const sellingPoints = [
  "РџРµСЂРµСЃС‚Р°РЅРµС‚Рµ С‚Р°С‰РёС‚СЊ РІСЃС‘ РЅР° СЃРµР±Рµ: СЃРёСЃС‚РµРјР° СЂРѕР»РµР№ Рё РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚Рё",
  "РљР°С‡РµСЃС‚РІРѕ Рё СЃСЂРѕРєРё СЃС‚Р°РЅСѓС‚ СѓРїСЂР°РІР»СЏРµРјС‹РјРё: С‡РµРє-Р»РёСЃС‚С‹ Рё РєРѕРЅС‚СЂРѕР»СЊ",
  "РљРѕРјР°РЅРґР° РЅР°С‡РЅС‘С‚ РґР°РІР°С‚СЊ СЂРµР·СѓР»СЊС‚Р°С‚: KPI + РјРѕС‚РёРІР°С†РёСЏ Р±РµР· С…Р°РѕСЃР°",
  "РќР°Р№Рј СЃС‚Р°РЅРµС‚ РїСЂРµРґСЃРєР°Р·СѓРµРјС‹Рј: РІРѕСЂРѕРЅРєР° + Р°РґР°РїС‚Р°С†РёСЏ",
  "РњРѕР¶РЅРѕ РјР°СЃС€С‚Р°Р±РёСЂРѕРІР°С‚СЊ: СЃС‚СЂСѓРєС‚СѓСЂР° В«РїРѕРґ СЂРѕСЃС‚В», Р° РЅРµ В«РЅР° СѓРґР°С‡РµВ»",
];

const practicalTasks = [
  "Р”РёР°РіРЅРѕСЃС‚РёРєР° РєРѕРјР°РЅРґС‹: В«РіРґРµ С‚РµСЂСЏРµС‚СЃСЏ СЂРµР·СѓР»СЊС‚Р°С‚В»",
  "РџРѕСЃС‚СЂРѕРµРЅРёРµ РѕСЂРіСЃС‚СЂСѓРєС‚СѓСЂС‹ РїРѕРґ РІР°С€ СЂР°Р·РјРµСЂ",
  "РћРїРёСЃР°РЅРёРµ 5вЂ“10 РєР»СЋС‡РµРІС‹С… СЂРѕР»РµР№ (РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚СЊ + KPI)",
  "РЎРѕР·РґР°РЅРёРµ 3 СЂРµРіР»Р°РјРµРЅС‚РѕРІ Рё 5 С‡РµРє-Р»РёСЃС‚РѕРІ",
  "РќР°СЃС‚СЂРѕР№РєР° СЂРёС‚РјРѕРІ СѓРїСЂР°РІР»РµРЅРёСЏ (РїР»Р°РЅС‘СЂРєРё, РѕС‚С‡С‘С‚РЅРѕСЃС‚СЊ, РєРѕРЅС‚СЂРѕР»СЊ РєР°С‡РµСЃС‚РІР°)",
  "РџРѕРґРіРѕС‚РѕРІРєР° РїР°РєРµС‚Р° РЅР°Р№РјР°: РІР°РєР°РЅСЃРёСЏ + РІРѕРїСЂРѕСЃС‹ + С‚РµСЃС‚РѕРІРѕРµ",
  "РџР»Р°РЅ Р°РґР°РїС‚Р°С†РёРё СЃРѕС‚СЂСѓРґРЅРёРєР° РЅР° 30 РґРЅРµР№",
  "Р¤РёРЅР°Р»СЊРЅР°СЏ СЃР±РѕСЂРєР° В«РљРѕРјР°РЅРґРЅРѕРіРѕ СЃС‚Р°РЅРґР°СЂС‚Р° РєРѕРјРїР°РЅРёРёВ»",
];

const materials = [
  "РћСЂРіСЃС‚СЂСѓРєС‚СѓСЂС‹ РґР»СЏ РєРѕРјР°РЅРґ 3/7/15/30 С‡РµР»РѕРІРµРє",
  "РљР°СЂС‚РѕС‡РєР° СЂРѕР»Рё (РѕР±СЏР·Р°РЅРЅРѕСЃС‚Рё, KPI, РєРѕРјРїРµС‚РµРЅС†РёРё)",
  "RACI-РјР°С‚СЂРёС†Р° РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚Рё",
  "РЁР°Р±Р»РѕРЅС‹ СЂРµРіР»Р°РјРµРЅС‚РѕРІ Рё С‡РµРє-Р»РёСЃС‚РѕРІ",
  "РЎРєСЂРёРїС‚ СЃРѕР±РµСЃРµРґРѕРІР°РЅРёСЏ + С‚РµСЃС‚РѕРІС‹Рµ Р·Р°РґР°РЅРёСЏ",
  "РџР»Р°РЅ Р°РґР°РїС‚Р°С†РёРё 7/14/30 РґРЅРµР№",
  "Р”Р°С€Р±РѕСЂРґ СЂСѓРєРѕРІРѕРґРёС‚РµР»СЏ (РјРµС‚СЂРёРєРё РєРѕРјР°РЅРґС‹)",
];

const faqItems = [
  {
    question: "Р”Р»СЏ РєР°РєРёС… РєРѕРјР°РЅРґ РїРѕРґС…РѕРґРёС‚ СЌС‚РѕС‚ РєСѓСЂСЃ?",
    answer:
      "РљСѓСЂСЃ РїРѕРґС…РѕРґРёС‚ РґР»СЏ РєРѕРјР°РЅРґ РѕС‚ 1 РґРѕ 30+ С‡РµР»РѕРІРµРє. РџСЂРѕРіСЂР°РјРјР° РІРєР»СЋС‡Р°РµС‚ СЂРµС€РµРЅРёСЏ РґР»СЏ СЂР°Р·РЅС‹С… СЌС‚Р°РїРѕРІ СЂРѕСЃС‚Р°: РѕС‚ РЅР°Р№РјР° РїРµСЂРІС‹С… СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ РґРѕ СЃРѕР·РґР°РЅРёСЏ СѓРїСЂР°РІР»РµРЅС‡РµСЃРєРёС… СѓСЂРѕРІРЅРµР№ Рё РѕС‚РґРµР»РѕРІ.",
  },
  {
    question: "РљР°Рє РїСЂРѕС…РѕРґРёС‚ РѕР±СѓС‡РµРЅРёРµ?",
    answer:
      "РћР±СѓС‡РµРЅРёРµ РїСЂРѕС…РѕРґРёС‚ РІ С„РѕСЂРјР°С‚Рµ 8вЂ“10 РЅРµРґРµР»СЊ: 1вЂ“2 Р·Р°РЅСЏС‚РёСЏ РІ РЅРµРґРµР»СЋ РїРѕ 90вЂ“120 РјРёРЅСѓС‚. Р’РєР»СЋС‡Р°РµС‚ С‚РµРѕСЂРёСЋ, РґРѕРјР°С€РЅРёРµ Р·Р°РґР°РЅРёСЏ, СЂР°Р·Р±РѕСЂС‹ РєРµР№СЃРѕРІ СѓС‡Р°СЃС‚РЅРёРєРѕРІ Рё С‡Р°С‚ РїРѕРґРґРµСЂР¶РєРё.",
  },
  {
    question: "РџРѕРґРѕР№РґС‘С‚ Р»Рё РєСѓСЂСЃ РґР»СЏ СЋСЂРёРґРёС‡РµСЃРєРёС… РєРѕРјРїР°РЅРёР№?",
    answer:
      "Р”Р°, РєСѓСЂСЃ СЃРїРµС†РёР°Р»СЊРЅРѕ Р°РґР°РїС‚РёСЂРѕРІР°РЅ РґР»СЏ СЋСЂРёРґРёС‡РµСЃРєРёС… РєРѕРјРїР°РЅРёР№ РІ СЃС„РµСЂРµ Р‘Р¤Р› Рё СЃРјРµР¶РЅС‹С… СѓСЃР»СѓРі, РіРґРµ РІР°Р¶РЅС‹ РјР°СЃСЃРѕРІРѕРµ РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ, СЃСЂРѕРєРё, РґРѕРєСѓРјРµРЅС‚С‹ Рё РєРѕРјРјСѓРЅРёРєР°С†РёРё СЃ РєР»РёРµРЅС‚Р°РјРё.",
  },
  {
    question: "РљР°РєРёРµ РјР°С‚РµСЂРёР°Р»С‹ СЏ РїРѕР»СѓС‡Сѓ?",
    answer:
      "Р’С‹ РїРѕР»СѓС‡РёС‚Рµ С€Р°Р±Р»РѕРЅС‹ РѕСЂРіСЃС‚СЂСѓРєС‚СѓСЂ, РєР°СЂС‚РѕС‡РєРё СЂРѕР»РµР№, RACI-РјР°С‚СЂРёС†С‹, СЂРµРіР»Р°РјРµРЅС‚С‹, С‡РµРє-Р»РёСЃС‚С‹, СЃРєСЂРёРїС‚С‹ СЃРѕР±РµСЃРµРґРѕРІР°РЅРёР№, РїР»Р°РЅС‹ Р°РґР°РїС‚Р°С†РёРё Рё РґР°С€Р±РѕСЂРґ СЂСѓРєРѕРІРѕРґРёС‚РµР»СЏ РґР»СЏ РѕС‚СЃР»РµР¶РёРІР°РЅРёСЏ РјРµС‚СЂРёРє РєРѕРјР°РЅРґС‹.",
  },
  {
    question: "РњРѕР¶РЅРѕ Р»Рё РїСЂРёРјРµРЅСЏС‚СЊ РёРЅСЃС‚СЂСѓРјРµРЅС‚С‹ РєСѓСЂСЃР° СЃСЂР°Р·Сѓ?",
    answer:
      "Р”Р°, РїСЂРѕРіСЂР°РјРјР° РїРѕСЃС‚СЂРѕРµРЅР° С‚Р°Рє, С‡С‚РѕР±С‹ РІС‹ РІРЅРµРґСЂСЏР»Рё РёРЅСЃС‚СЂСѓРјРµРЅС‚С‹ РїР°СЂР°Р»Р»РµР»СЊРЅРѕ СЃ РѕР±СѓС‡РµРЅРёРµРј. РљР°Р¶РґРѕРµ Р·Р°РґР°РЅРёРµ вЂ” СЌС‚Рѕ РїСЂР°РєС‚РёС‡РµСЃРєРёР№ С€Р°Рі Рє РїРѕСЃС‚СЂРѕРµРЅРёСЋ РІР°С€РµР№ СЃРёСЃС‚РµРјС‹ СѓРїСЂР°РІР»РµРЅРёСЏ РєРѕРјР°РЅРґРѕР№.",
  },
  {
    question: "Р§С‚Рѕ Р±СѓРґРµС‚ РЅР° РІС‹С…РѕРґРµ?",
    answer:
      "Р“РѕС‚РѕРІР°СЏ СЃРёСЃС‚РµРјР° СѓРїСЂР°РІР»РµРЅРёСЏ РєРѕРјР°РЅРґРѕР№: РѕСЂРіСЃС‚СЂСѓРєС‚СѓСЂР°, СЂРѕР»Рё СЃ KPI, СЂРµРіР»Р°РјРµРЅС‚С‹, РїСЂРѕС†РµСЃСЃС‹ РЅР°Р№РјР° Рё Р°РґР°РїС‚Р°С†РёРё, СЂРёС‚РјС‹ СѓРїСЂР°РІР»РµРЅРёСЏ. Р’СЃС‘ СЌС‚Рѕ РјРѕР¶РЅРѕ РІРЅРµРґСЂРёС‚СЊ Р·Р° 30 РґРЅРµР№ РїРѕСЃР»Рµ РєСѓСЂСЃР°.",
  },
  {
    question: "РќСѓР¶РµРЅ Р»Рё РѕРїС‹С‚ СѓРїСЂР°РІР»РµРЅРёСЏ РєРѕРјР°РЅРґРѕР№?",
    answer:
      "РќРµС‚, РєСѓСЂСЃ РїРѕРґС…РѕРґРёС‚ РєР°Рє РґР»СЏ РЅР°С‡РёРЅР°СЋС‰РёС… СЂСѓРєРѕРІРѕРґРёС‚РµР»РµР№, С‚Р°Рє Рё РґР»СЏ РѕРїС‹С‚РЅС‹С…. РџСЂРѕРіСЂР°РјРјР° СЃС‚СЂСѓРєС‚СѓСЂРёСЂРѕРІР°РЅР° РѕС‚ Р±Р°Р·РѕРІС‹С… РїСЂРёРЅС†РёРїРѕРІ РґРѕ РїСЂРѕРґРІРёРЅСѓС‚С‹С… СѓРїСЂР°РІР»РµРЅС‡РµСЃРєРёС… РёРЅСЃС‚СЂСѓРјРµРЅС‚РѕРІ.",
  },
];

const teamOrder = ["Р°СЂС‚РёРЅ", "СЃРёР·РѕРІ", "РіРµСЂР°СЃРёРјРѕРІ", "Р»СЏС‰РµРЅРєРѕ"];

const teamFallback: Teacher[] = [
  {
    id: "fallback-artin",
    full_name: "Р’Р°СЃРёР»РёР№ РђР»РµРєСЃРµРµРІРёС‡ РђСЂС‚РёРЅ",
    position: "Р’РµРґСѓС‰РёР№ СЌРєСЃРїРµСЂС‚ РєСѓСЂСЃР°",
    bio: "Р­РєСЃРїРµСЂС‚ РїРѕ РїРѕСЃС‚СЂРѕРµРЅРёСЋ Рё РјР°СЃС€С‚Р°Р±РёСЂРѕРІР°РЅРёСЋ РєРѕРјР°РЅРґ РІ СЃС„РµСЂРµ Р±Р°РЅРєСЂРѕС‚СЃС‚РІР°.",
    expertise: "РћСЂРіР°РЅРёР·Р°С†РёРѕРЅРЅРѕРµ СЂР°Р·РІРёС‚РёРµ, СѓРїСЂР°РІР»РµРЅРёРµ РєРѕРјР°РЅРґР°РјРё, РїРѕСЃС‚СЂРѕРµРЅРёРµ СЃРёСЃС‚РµРј.",
    experience: "15+ Р»РµС‚ РІ СѓРїСЂР°РІР»РµРЅРёРё",
    photo_url: "",
    display_order: 1,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-sizov",
    full_name: "РЎРёР·РѕРІ",
    position: "Р­РєСЃРїРµСЂС‚ РєСѓСЂСЃР°",
    bio: "РЎРїРµС†РёР°Р»РёСЃС‚ РїРѕ РѕРїРµСЂР°С†РёРѕРЅРЅРѕРјСѓ СѓРїСЂР°РІР»РµРЅРёСЋ Рё СЃС‚Р°РЅРґР°СЂС‚РёР·Р°С†РёРё РїСЂРѕС†РµСЃСЃРѕРІ.",
    expertise: "РћРїРµСЂР°С†РёРѕРЅРЅРѕРµ СѓРїСЂР°РІР»РµРЅРёРµ, СЂРµРіР»Р°РјРµРЅС‚С‹, РєРѕРЅС‚СЂРѕР»СЊ РєР°С‡РµСЃС‚РІР°.",
    experience: "РџСЂР°РєС‚РёРєСѓСЋС‰РёР№ СЌРєСЃРїРµСЂС‚",
    photo_url: "",
    display_order: 2,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-gerasimov",
    full_name: "Р“РµСЂР°СЃРёРјРѕРІ РђР»РµРєСЃР°РЅРґСЂ Р’Р°Р»РµСЂСЊРµРІРёС‡",
    position: "Р­РєСЃРїРµСЂС‚ РєСѓСЂСЃР°",
    bio: "РЎРїРµС†РёР°Р»РёСЃС‚ РїРѕ KPI Рё СЃРёСЃС‚РµРјР°Рј РјРѕС‚РёРІР°С†РёРё.",
    expertise: "РЈРїСЂР°РІР»РµРЅРёРµ СЌС„С„РµРєС‚РёРІРЅРѕСЃС‚СЊСЋ, KPI, РјРѕС‚РёРІР°С†РёРѕРЅРЅС‹Рµ СЃРёСЃС‚РµРјС‹.",
    experience: "РџСЂР°РєС‚РёРєСѓСЋС‰РёР№ СЌРєСЃРїРµСЂС‚",
    photo_url: "",
    display_order: 3,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-lyashchenko",
    full_name: "Р›СЏС‰РµРЅРєРѕ Р•Р»РµРЅР° Р®СЂСЊРµРІРЅР°",
    position: "Р­РєСЃРїРµСЂС‚ РєСѓСЂСЃР°",
    bio: "РЎРїРµС†РёР°Р»РёСЃС‚ РїРѕ HR Рё РЅР°Р№РјСѓ РІ СЋСЂРёРґРёС‡РµСЃРєРёС… РєРѕРјРїР°РЅРёСЏС….",
    expertise: "РџРѕРґР±РѕСЂ РїРµСЂСЃРѕРЅР°Р»Р°, Р°РґР°РїС‚Р°С†РёСЏ, РєРѕСЂРїРѕСЂР°С‚РёРІРЅР°СЏ РєСѓР»СЊС‚СѓСЂР°.",
    experience: "РџСЂР°РєС‚РёРєСѓСЋС‰РёР№ СЌРєСЃРїРµСЂС‚",
    photo_url: "",
    display_order: 4,
    is_published: true,
    created_at: "",
    updated_at: "",
  },
];

const fallbackStudentCases: StudentCase[] = [
  {
    id: "fallback-case-1",
    course_id: "",
    student_name: "Р”РјРёС‚СЂРёР№ Рљ.",
    student_role: "Р СѓРєРѕРІРѕРґРёС‚РµР»СЊ СЋСЂРёРґРёС‡РµСЃРєРѕР№ РєРѕРјРїР°РЅРёРё",
    case_text:
      "Р СѓРєРѕРІРѕРґРёР» РєРѕРјР°РЅРґРѕР№ РёР· 5 С‡РµР»РѕРІРµРє, РїРѕСЃС‚РѕСЏРЅРЅРѕ РІСЃС‘ РґРµР»Р°Р» СЃР°Рј, СЃСЂС‹РІР°Р»РёСЃСЊ СЃСЂРѕРєРё. РџРѕСЃР»Рµ РєСѓСЂСЃР° РїРѕСЃС‚СЂРѕРёР» РѕСЂРіСЃС‚СЂСѓРєС‚СѓСЂСѓ, РІРЅРµРґСЂРёР» KPI, РєРѕРјР°РЅРґР° РІС‹СЂРѕСЃР»Р° РґРѕ 12 С‡РµР»РѕРІРµРє.",
    result_text: "Р РµР·СѓР»СЊС‚Р°С‚: РѕСЃРІРѕР±РѕРґРёР» 60% РІСЂРµРјРµРЅРё РЅР° СЂР°Р·РІРёС‚РёРµ Р±РёР·РЅРµСЃР°",
    is_published: true,
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-2",
    course_id: "",
    student_name: "Р•Р»РµРЅР° Рњ.",
    student_role: "Р’Р»Р°РґРµР»РµС† РїСЂР°РєС‚РёРєРё Р‘Р¤Р›",
    case_text:
      "Р®СЂРёРґРёС‡РµСЃРєР°СЏ РєРѕРјРїР°РЅРёСЏ, 8 СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ, С…Р°РѕСЃ РІ Р·Р°РґР°С‡Р°С…, РєР°С‡РµСЃС‚РІРѕ В«РїСЂС‹РіР°Р»РѕВ». Р’РЅРµРґСЂРёР»Р° СЂРµРіР»Р°РјРµРЅС‚С‹ Рё С‡РµРє-Р»РёСЃС‚С‹ РїРѕ РІСЃРµРј СЌС‚Р°РїР°Рј Р‘Р¤Р›.",
    result_text: "Р РµР·СѓР»СЊС‚Р°С‚: РїСЂРѕСЃСЂРѕС‡РєРё в€’80%, РїРѕРІС‚РѕСЂРЅС‹Рµ РѕР±СЂР°С‰РµРЅРёСЏ +40%",
    is_published: true,
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-3",
    course_id: "",
    student_name: "РђР»РµРєСЃР°РЅРґСЂ Р’.",
    student_role: "Р СѓРєРѕРІРѕРґРёС‚РµР»СЊ РѕС‚РґРµР»Р°",
    case_text:
      "РќРµ РјРѕРі РЅР°РЅСЏС‚СЊ РЅСѓР¶РЅС‹С… Р»СЋРґРµР№, 3 РёР· 5 РєР°РЅРґРёРґР°С‚РѕРІ СѓС…РѕРґРёР»Рё РІ РїРµСЂРІС‹Р№ РјРµСЃСЏС†. РЎРѕР·РґР°Р» СЃРёСЃС‚РµРјСѓ РЅР°Р№РјР° Рё Р°РґР°РїС‚Р°С†РёРё РїРѕ РјРѕРґРµР»Рё РёР· РєСѓСЂСЃР°.",
    result_text: "Р РµР·СѓР»СЊС‚Р°С‚: СѓРґРµСЂР¶Р°РЅРёРµ РЅРѕРІС‹С… СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ РІС‹СЂРѕСЃР»Рѕ РґРѕ 90%",
    is_published: true,
    display_order: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-4",
    course_id: "",
    student_name: "РСЂРёРЅР° РЎ.",
    student_role: "РЎРѕР±СЃС‚РІРµРЅРЅРёРє Р°РіРµРЅС‚СЃС‚РІР°",
    case_text:
      "РљРѕРјР°РЅРґР° 15 С‡РµР»РѕРІРµРє, РїР°РґРµРЅРёРµ РјРѕС‚РёРІР°С†РёРё, С‚РµРєСѓС‡РєР°, РєРѕРЅС„Р»РёРєС‚С‹ РјРµР¶РґСѓ РѕС‚РґРµР»Р°РјРё. Р’РЅРµРґСЂРёР»Р° СЃРёСЃС‚РµРјСѓ KPI Р±РµР· С‚РѕРєСЃРёС‡РЅРѕСЃС‚Рё, РїСЂРѕР·СЂР°С‡РЅСѓСЋ РјРѕС‚РёРІР°С†РёСЋ, РєСѓР»СЊС‚СѓСЂСѓ РѕР±СЂР°С‚РЅРѕР№ СЃРІСЏР·Рё.",
    result_text: "Р РµР·СѓР»СЊС‚Р°С‚: С‚РµРєСѓС‡РєР° СЃРЅРёР·РёР»Р°СЃСЊ СЃ 40% РґРѕ 12% РІ РіРѕРґ",
    is_published: true,
    display_order: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-5",
    course_id: "",
    student_name: "РњРёС…Р°РёР» Рў.",
    student_role: "Р”РёСЂРµРєС‚РѕСЂ РєРѕРјРїР°РЅРёРё",
    case_text:
      "РљРѕРјРїР°РЅРёСЏ РЅР° РіСЂР°РЅРё РєСЂРёР·РёСЃР°: СЃСЂС‹РІС‹ СЃСЂРѕРєРѕРІ, РЅРµРґРѕРІРѕР»СЊСЃС‚РІРѕ РєР»РёРµРЅС‚РѕРІ, 3 РєР»СЋС‡РµРІС‹С… СЃРѕС‚СЂСѓРґРЅРёРєР° СѓРІРѕР»РёР»РёСЃСЊ. РџСЂРёРјРµРЅРёР» Р°РЅС‚РёРєСЂРёР·РёСЃРЅС‹Р№ РјРѕРґСѓР»СЊ РєСѓСЂСЃР°.",
    result_text: "Р РµР·СѓР»СЊС‚Р°С‚: Р·Р° 2 РЅРµРґРµР»Рё СЃС‚Р°Р±РёР»РёР·Р°С†РёСЏ, Р·Р° 3 РјРµСЃСЏС†Р° вЂ” РЅРѕРІР°СЏ СЃРёСЃС‚РµРјР°",
    is_published: true,
    display_order: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-case-6",
    course_id: "",
    student_name: "РђРЅРЅР° Рџ.",
    student_role: "РћСЃРЅРѕРІР°С‚РµР»СЊ РїСЂР°РєС‚РёРєРё",
    case_text:
      "РҐРѕС‚РµР»Р° РјР°СЃС€С‚Р°Р±РёСЂРѕРІР°С‚СЊ Р±РёР·РЅРµСЃ, РЅРѕ Р±РѕСЏР»Р°СЃСЊ РЅР°РЅРёРјР°С‚СЊ: РЅРµРїРѕРЅСЏС‚РЅРѕ, РєРѕРіРѕ РёСЃРєР°С‚СЊ Рё РєР°Рє РєРѕРЅС‚СЂРѕР»РёСЂРѕРІР°С‚СЊ. РџРѕР»СѓС‡РёР»Р° РїРѕСЂС‚СЂРµС‚С‹ СЂРѕР»РµР№, РІРѕСЂРѕРЅРєСѓ РЅР°Р№РјР°, РїР»Р°РЅ Р°РґР°РїС‚Р°С†РёРё.",
    result_text: "Р РµР·СѓР»СЊС‚Р°С‚: Р·Р° 4 РјРµСЃСЏС†Р° РЅР°РЅСЏР»Р° 6 С‡РµР»РѕРІРµРє, РІСЃРµ РґР°СЋС‚ СЂРµР·СѓР»СЊС‚Р°С‚",
    is_published: true,
    display_order: 6,
    created_at: "",
    updated_at: "",
  },
];

export default function CourseEffectiveTeam() {
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [studentCases, setStudentCases] = useState<StudentCase[]>(fallbackStudentCases);
  const [loadingCases, setLoadingCases] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await api.teachers.list(true);
        setTeachers(data || []);
      } catch {
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };

    const fetchCases = async () => {
      try {
        const courses = await api.courses.list();
        const teamCourse = courses.find((course) => {
          const title = course.title.toLowerCase();
          return title.includes("СЌС„С„РµРєС‚РёРІРЅР°СЏ РєРѕРјР°РЅРґР°") || title.includes("РєРѕРјР°РЅРґ");
        });

        if (!teamCourse) {
          setStudentCases(fallbackStudentCases);
          return;
        }

        const data = await api.studentCases.list(true, teamCourse?.id);
        setStudentCases(data?.length ? data : fallbackStudentCases);
      } catch {
        setStudentCases(fallbackStudentCases);
      } finally {
        setLoadingCases(false);
      }
    };

    fetchTeachers();
    fetchCases();
  }, []);

  const sortedTeachers = useMemo(() => {
    const allTeachers = loadingTeachers ? teamFallback : teachers.length > 0 ? teachers : teamFallback;

    const sorted = [...allTeachers].sort((a, b) => {
      const aIndex = teamOrder.findIndex((name) => a.full_name.toLowerCase().includes(name));
      const bIndex = teamOrder.findIndex((name) => b.full_name.toLowerCase().includes(name));

      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    return sorted.filter((_, index) => index < teamOrder.length);
  }, [teachers, loadingTeachers]);

  const toggleModule = (index: number) => {
    setOpenModuleIndex((prev) => (prev === index ? null : index));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="animate-page-enter">
        {/* Hero */}
        <section className="py-16 sm:py-20">
          <div className="container max-w-6xl">
            <div className="grid gap-6 rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-blue-500 p-6 sm:p-8 lg:grid-cols-2 lg:p-10">
              <div className="text-white">
                <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">Р­С„С„РµРєС‚РёРІРЅР°СЏ РєРѕРјР°РЅРґР°</h1>
                <p className="mt-2 text-lg font-medium text-white/90">РљСѓСЂСЃ РґР»СЏ СЂСѓРєРѕРІРѕРґРёС‚РµР»РµР№ СЋСЂРёРґРёС‡РµСЃРєРѕРіРѕ Р±РёР·РЅРµСЃР°</p>
                <p className="mt-6 text-lg leading-relaxed text-white/90 sm:text-xl">
                  РџСЂР°РєС‚РёС‡РµСЃРєРёР№ РєСѓСЂСЃ РґР»СЏ СЂСѓРєРѕРІРѕРґРёС‚РµР»РµР№, РєРѕС‚РѕСЂС‹Рµ С…РѕС‚СЏС‚ СЃРѕР±СЂР°С‚СЊ СЌС„С„РµРєС‚РёРІРЅСѓСЋ РєРѕРјР°РЅРґСѓ Рё РІС‹Р№С‚Рё РёР· РѕРїРµСЂР°С†РёРѕРЅРєРё:
                  РѕСЂРіСЃС‚СЂСѓРєС‚СѓСЂР° Рё СЂРѕР»Рё, KPI Рё РјРѕС‚РёРІР°С†РёСЏ, РїСЂРѕС†РµСЃСЃС‹ Рё СЂРµРіР»Р°РјРµРЅС‚С‹, РЅР°Р№Рј Рё Р°РґР°РїС‚Р°С†РёСЏ.
                </p>
                <div className="mt-8 grid gap-3">
                  {highlights.map((item) => (
                    <div key={item} className="rounded-xl border border-white/20 bg-white/10 p-3 text-sm font-medium text-white">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div id="course-form">
                <LeadFormContent compact />
              </div>
            </div>
          </div>
        </section>

        {/* Р”Р»СЏ РєРѕРіРѕ РєСѓСЂСЃ */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Р”Р»СЏ РєРѕРіРѕ СЌС‚РѕС‚ РєСѓСЂСЃ</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {audience.map((item) => (
                <article key={item} className="relative overflow-hidden rounded-2xl border bg-card p-6">
                  <span className="pointer-events-none absolute -left-6 top-0 h-full w-4 -rotate-12 bg-primary/10" />
                  <span className="pointer-events-none absolute right-10 top-0 h-full w-3 rotate-6 bg-primary/10" />
                  <span className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-primary/15" />
                  <p className="text-lg leading-relaxed text-foreground">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Р§С‚Рѕ РїРѕР»СѓС‡РёС‚Рµ РЅР° РІС‹С…РѕРґРµ */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Р§С‚Рѕ Р±СѓРґРµС‚ РЅР° РІС‹С…РѕРґРµ</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sellingPoints.map((item, index) => {
                const icons = [Target, Settings, TrendingUp, Users, Sparkles];
                const Icon = icons[index % icons.length];
                return (
                  <article key={item} className="relative overflow-hidden rounded-2xl border bg-card p-6">
                    <span className="pointer-events-none absolute -left-5 top-0 h-full w-3 -rotate-12 bg-primary/10" />
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-base font-medium text-foreground">{item}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* РџСЂРѕРіСЂР°РјРјР° РєСѓСЂСЃР° */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-heading text-3xl font-bold">РџСЂРѕРіСЂР°РјРјР° РєСѓСЂСЃР°</h2>
              <p className="text-sm font-medium text-primary">{lessons.length} РјРѕРґСѓР»РµР№</p>
            </div>

            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const isOpen = openModuleIndex === index;
                return (
                  <article key={lesson.title} className="overflow-hidden rounded-2xl border bg-card">
                    <button
                      type="button"
                      onClick={() => toggleModule(index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {index + 1}
                        </div>
                        <h3 className="font-heading text-xl font-semibold text-foreground">{lesson.title}</h3>
                      </div>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </span>
                    </button>

                    {isOpen ? (
                      <div className="border-t bg-muted/20 p-5">
                        <ul className="space-y-2">
                            {lesson.points.map((point) => (
                            <li key={point} className="flex items-start gap-3 text-muted-foreground">
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* РџСЂР°РєС‚РёС‡РµСЃРєРёРµ Р·Р°РґР°РЅРёСЏ */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">РџСЂР°РєС‚РёРєР° Рё Р·Р°РґР°РЅРёСЏ</h2>
            <p className="text-lg text-muted-foreground">
              РљСѓСЂСЃ РїРѕСЃС‚СЂРѕРµРЅ РЅР° РїСЂР°РєС‚РёРєРµ вЂ” РІС‹ РЅРµ РїСЂРѕСЃС‚Рѕ СЃР»СѓС€Р°РµС‚Рµ С‚РµРѕСЂРёСЋ, Р° СЃРѕР·РґР°С‘С‚Рµ РёРЅСЃС‚СЂСѓРјРµРЅС‚С‹ РґР»СЏ СЃРІРѕРµР№ РєРѕРјР°РЅРґС‹:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {practicalTasks.map((task) => (
                <article
                  key={task}
                  className="flex items-start gap-3 rounded-xl border bg-card p-4"
                >
                  <BookOpenCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-base text-foreground">{task}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* РњР°С‚РµСЂРёР°Р»С‹ РєСѓСЂСЃР° */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">РњР°С‚РµСЂРёР°Р»С‹ РєСѓСЂСЃР°</h2>
            <p className="text-lg text-muted-foreground">
              Р’СЃРµ СѓС‡Р°СЃС‚РЅРёРєРё РїРѕР»СѓС‡Р°СЋС‚ РіРѕС‚РѕРІС‹Рµ С€Р°Р±Р»РѕРЅС‹ Рё РёРЅСЃС‚СЂСѓРјРµРЅС‚С‹ РґР»СЏ РІРЅРµРґСЂРµРЅРёСЏ:
            </p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <article
                  key={material}
                  className="flex items-start gap-3 rounded-xl border bg-card p-4"
                >
                  <Files className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-sm font-medium text-foreground">{material}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* РљРѕРјР°РЅРґР° РїСЂРµРїРѕРґР°РІР°С‚РµР»РµР№ */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">РљРѕРјР°РЅРґР° РїСЂРµРїРѕРґР°РІР°С‚РµР»РµР№</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {sortedTeachers.map((teacher) => (
                <article key={teacher.id} className="overflow-hidden rounded-2xl border bg-card">
                  <div className="aspect-square overflow-hidden bg-muted">
                    {teacher.photo_url ? (
                      <img
                        src={teacher.photo_url}
                        alt={teacher.full_name}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10">
                        <span className="text-4xl font-bold text-primary">
                          {teacher.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {teacher.full_name}
                    </h3>
                    <p className="mt-1 text-sm text-primary">{teacher.position}</p>
                    {teacher.expertise && (
                      <p className="mt-2 text-sm text-muted-foreground">{teacher.expertise}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-6">
          <div className="container max-w-6xl">
            <article className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-primary/10 blur-2xl" />
                <span className="absolute right-10 top-0 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
              </div>

              <div className="relative">
                <h2 className="text-center font-heading text-3xl font-bold text-foreground">
                  Р“РѕС‚РѕРІС‹ РїРѕСЃС‚СЂРѕРёС‚СЊ СЌС„С„РµРєС‚РёРІРЅСѓСЋ РєРѕРјР°РЅРґСѓ?
                </h2>
                <p className="mt-3 text-center text-lg text-muted-foreground">
                  Р—Р°РїРёСЃС‹РІР°Р№С‚РµСЃСЊ РЅР° РєСѓСЂСЃ Рё РїРѕР»СѓС‡РёС‚Рµ РіРѕС‚РѕРІСѓСЋ СЃРёСЃС‚РµРјСѓ СѓРїСЂР°РІР»РµРЅРёСЏ Р·Р° 8вЂ“10 РЅРµРґРµР»СЊ
                </p>

                <div className="mt-8">
                  <Button 
                    className="h-14 w-full text-base font-semibold"
                    onClick={() => setIsFormOpen(true)}
                  >
                    РћС‚РєСЂС‹С‚СЊ С„РѕСЂРјСѓ Р·Р°СЏРІРєРё
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* РљРµР№СЃС‹ СЃС‚СѓРґРµРЅС‚РѕРІ */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">РљРµР№СЃС‹ РЅР°С€РёС… СЃС‚СѓРґРµРЅС‚РѕРІ</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {studentCases.map((item) => (
                <article key={item.id} className="rounded-3xl border bg-muted/30 p-6">
                  <h3 className="text-2xl font-semibold text-foreground">{item.student_name}</h3>
                  {item.student_role ? <p className="mt-2 text-muted-foreground">{item.student_role}</p> : null}
                  <p className="mt-6 text-lg leading-relaxed text-foreground/80">{item.case_text}</p>
                  {item.result_text ? <p className="mt-5 text-base font-semibold text-primary">{item.result_text}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <CourseInstallmentBlock courseName="Построение эффективной команды" />

        {/* FAQ */}
        <section className="py-10">
          <div className="container max-w-6xl space-y-5">
            <h2 className="font-heading text-3xl font-bold">Р§Р°СЃС‚Рѕ Р·Р°РґР°РІР°РµРјС‹Рµ РІРѕРїСЂРѕСЃС‹</h2>
            <div className="space-y-3">
              {faqItems.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <article key={faq.question} className="overflow-hidden rounded-2xl border bg-card">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <h3 className="text-xl font-semibold text-foreground">{faq.question}</h3>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="relative border-t bg-muted/20 p-5">
                        <span className="pointer-events-none absolute left-6 top-0 h-full w-2 -rotate-12 bg-primary/10" />
                        <p className="relative pl-3 text-muted-foreground">{faq.answer}</p>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>


        {/* Bottom CTA */}
        <section id="apply" className="py-14">
          <div className="container max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
              <span className="pointer-events-none absolute left-[5%] top-0 h-full w-4 -rotate-12 bg-primary/10" />
              <span className="pointer-events-none absolute left-[42%] top-0 h-full w-3 rotate-[8deg] bg-primary/10" />
              <span className="pointer-events-none absolute right-[12%] top-0 h-full w-4 -rotate-[6deg] bg-primary/10" />
              <h2 className="relative font-heading text-3xl font-bold">
                РќР°С‡РЅРёС‚Рµ СЃС‚СЂРѕРёС‚СЊ РєРѕРјР°РЅРґСѓ, РєРѕС‚РѕСЂР°СЏ РїСЂРёРЅРѕСЃРёС‚ СЂРµР·СѓР»СЊС‚Р°С‚
              </h2>
              <p className="relative mt-3 text-muted-foreground">
                РћСЃС‚Р°РІСЊС‚Рµ Р·Р°СЏРІРєСѓ вЂ” РїРѕР»СѓС‡РёС‚Рµ РїСЂРѕРіСЂР°РјРјСѓ РєСѓСЂСЃР°, СѓСЃР»РѕРІРёСЏ СѓС‡Р°СЃС‚РёСЏ Рё РєРѕРЅСЃСѓР»СЊС‚Р°С†РёСЋ РїРѕ РїРѕРґР±РѕСЂСѓ С„РѕСЂРјР°С‚Р°
                РѕР±СѓС‡РµРЅРёСЏ.
              </p>
              <div className="relative mt-6">
                <Button size="lg" onClick={() => setIsFormOpen(true)}>
                  Р—Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РєСѓСЂСЃ
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[96vw] max-w-[760px] p-4 sm:p-6">
          <DialogTitle className="sr-only">Р—Р°РїРёСЃСЊ РЅР° РєСѓСЂСЃ</DialogTitle>
          <LeadFormContent compact />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
