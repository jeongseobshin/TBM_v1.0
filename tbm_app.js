/* =========================================================================
   TBM 통합관리 시스템  ·  Tool Box Meeting Management
   - 사용자 페이지(관리감독자) + 관리자 페이지(안전보건담당자)
   - 공통 데이터베이스(localStorage 기반, 내보내기/가져오기로 기기 간 이전)
   ========================================================================= */

/* ==== 콘텐츠 데이터베이스 (각 항목: [위험요인, 위험방지대책]) ==== */
const TBM_DB = {
  categories: [
    { id: "material",  name: "소재제조팀",    type: "dept" },
    { id: "packaging", name: "충포장팀",      type: "dept" },
    { id: "scm",       name: "SCM 자재팀",    type: "dept" },
    { id: "quality",   name: "품질팀",        type: "dept" },
    { id: "ansan",     name: "안산사업장",    type: "dept" },
    { id: "common",    name: "전 부서(공통)", type: "common" },
    { id: "summer",    name: "혹서기(6~8월)", type: "season" },
    { id: "winter",    name: "혹한기(12~1월)", type: "season" }
  ],
  common: [
    ["미세먼지에 따른 건강관리 / 분진", "-쉬는 시간 충분한 수분섭취 -분진 전용 마스크 착용 -개인위생 강조 -고령·질환자 수시 관찰"],
    ["응급상황 대처", "-발생 직후 응급처치 -응급 상황 발생 시 관리감독자 우선 보고 -경중에 따라 협력병원 또는 119 신고"],
    ["근골격계 예방 정자세(중량물 작업)", "-작업 전 스트레칭 -2인1조 작업(최우선) -1인 작업 시 정자세 준수 -대차 및 끌개 사용 권장"],
    ["작업중지권", "-근로자 위험 판단 -관리감독자 알림 -해당상황 조치 시까지 작업 중지"],
    ["작업장 정리정돈", "-작업 도구 정위치 -설비 주변 정리 시 전원차단 후 실시"],
    ["비상연락망 공유", "-관리감독자·팀장 비상연락처 게시 -본사 안전파트 비상연락처 게시 -협력병원 연락처 공유"],
    ["화재 예방", "-주변 소화기 위치 파악 -외부 대피로 확인 -흡연 후 필터 확인"],
    ["근골격계질환 예방", "-작업 전 스트레칭 -5kg 이상 중량물 2인1조 -이동 시 대차 사용"],
    ["보호구 착용 중요성", "-분진·소음 발생지 마스크·이어플러그 착용 -현장 내 안전화 필수 착용 -근로자 필요 보호구 요구 조사"],
    ["작업 후 점검 철저", "-작업 도구 정위치 -설비 정리 시 전원차단 -지게차 키 보관함 보관 -칼·가위 정위치 보관"]
  ],
  material: [
    ["프레스 금형 잔류물로 인한 화상", "작업 전 잔류물 제거 및 보호장비 착용"],
    ["물레 주변 바닥 습기로 인한 미끄러짐", "물기 제거 및 논슬립 매트 설치"],
    ["장시간 반복작업에 따른 근골격계 질환", "작업 중 스트레칭 실시 및 작업 자세 교육"],
    ["작업장 내 통로 협소로 인한 충돌 위험", "통로 확보 및 작업장 정리정돈 철저"],
    ["전기 콘센트 주변 먼지 누적으로 인한 감전", "정기 청소 및 누전차단기 정상 작동 확인"],
    ["프레스 조작 중 손 끼임", "프레스 사용 전 점검 및 안전수칙 준수"],
    ["물레 작업 중 회전부 옷 끼임", "단정한 복장 유지 및 회전부 접근 금지"],
    ["금형 교체 시 낙하물 위험", "작업 전 금형 고정 확인 및 보호구 착용"],
    ["소재 절단 시 칼날 이탈", "칼날 점검 및 이탈 방지 가이드 설치"],
    ["소재 투입 시 손 끼임", "투입구 가드 설치 및 공구 사용"],
    ["소재 절단 시 비산물로 인한 눈 부상", "보안경 착용 및 소재 고정 후 절단"],
    ["설비 유지보수 중 오작동으로 인한 협착", "점검 전 전원 차단 및 잠금표시(Lock-out) 적용"],
    ["프레스 주변 정리 미흡으로 인한 전도", "작업 전후 공구·자재 정리정돈 철저"],
    ["공정 간 이송 중 들림 동작으로 인한 허리 통증", "리프터 사용 권장 및 2인 1조 작업"],
    ["물레 회전 시 소음 노출에 따른 청력 손상", "귀마개 착용 및 소음측정 통한 주기적 관리"]
  ],
  packaging: [
    ["충진기 작동 중 손·팔 끼임", "작동 중 손 접근 금지, 안전커버 설치 및 비상정지 장치 작동 교육"],
    ["자재 사이 이동 시 협소 공간 충돌", "이동 경로 확보 및 진입 전 시야확보"],
    ["이동 중 다른 작업자와 충돌", "이동 전 주변확인 및 지정된 통로 이용"],
    ["재포장 작업 중 포장지에 의한 베임", "작업용 장갑 착용 및 포장지 끝부분 주의"],
    ["납품 수량 오류로 인한 재포장 작업 발생", "수량 확인 절차 이중 점검"],
    ["무거운 자재 적재 시 높이 부족으로 인한 충격", "적정 높이 확보 및 충돌방지 패드 부착"],
    ["충진기 센서 오작동으로 인한 과충진·불량", "센서 주기적 점검, 예비 부품 비치, 초기 시험 운전 실시"],
    ["포장 시 정전기 발생으로 인한 불쾌감", "정전기 방지 장비 사용 및 습도 조절"],
    ["기계 내부 청소 중 사고", "세척 전 전원 차단, Lock-out/Tag-out 절차 적용"],
    ["포장 테이블 모서리 충돌로 인한 타박상", "모서리 완충재 설치 및 작업 동선 조정"],
    ["충진량 오류로 인한 내용물 누출·바닥 오염", "자동 충진센서 정기 점검 및 유량 조절 밸브 관리"],
    ["무거운 상자 운반 시 요통", "적정 무게 이하로 나눠서 운반"],
    ["바닥 박스 방치로 인한 걸림", "작업 중 수시 정리정돈"],
    ["낙상사고(파렛트 위 이동)", "작업발판 사용 및 금지 구역 설정"],
    ["충진기 노즐 막힘으로 인한 압력 이상·파손", "노즐 정기 세척, 이물질 필터 장착 및 압력계 수시 점검"]
  ],
  scm: [
    ["지게차 후진 시 보행자 충돌", "클락션 울림 및 감시자 배치"],
    ["지게차 상하차 중 적재물 낙하", "하차 전 고정 및 평탄한 작업장 확보"],
    ["화물차량 후진 중 접촉사고", "후방감시자 배치 및 후진경고음 사용"],
    ["지게차 운전 중 주의 산만", "작업 중 대화 자제 및 집중 운전"],
    ["팔레트 이동 중 부상", "보호구 착용 및 진로 확보"],
    ["지게차 작업 시 사각지대 충돌", "반사조끼 착용 및 사각지대 내 감시자 배치"],
    ["화물차 적재 중 균형 무너짐", "하중 분산 적재 및 고정 장비 활용"],
    ["지게차 충전 중 전기 화재", "충전 시 전원 차단 및 충전 장소 청결 유지"],
    ["파렛트 파손으로 인한 하중 낙하", "파렛트 상태 점검 및 불량 파렛트 폐기"],
    ["작업 중 통신 부재로 긴급상황 대처 지연", "무전기 휴대 및 비상 연락 체계 확보"],
    ["지게차 작업장 내 보행자 출입 통제 미흡", "출입 제한구역 설정 및 사전 안전교육 실시"],
    ["하역 작업 시 무거운 물품으로 인한 손목 부상", "손목 보호대 착용 및 작업 전 스트레칭"],
    ["지게차 급정거로 인한 적재물 쏠림", "적재 시 무게 중심 고려 및 감속 운전"],
    ["작업 중 파렛트 모서리에 찔림", "파렛트 상태 점검 및 손 보호구 착용"],
    ["혼잡한 공간에서의 차량 경로 혼선", "일방통행 경로 지정 및 유도선·표지판 설치"]
  ],
  quality: [
    ["불충분한 조명으로 인한 검수 누락", "충분한 조명 확보 및 위치 조정"],
    ["장시간 검수로 인한 눈 피로", "일정한 눈 휴식 실시"],
    ["검수대 정리 미흡으로 인한 낙상", "검수 후 즉시 정리정돈"],
    ["검사 도구 부재로 인한 임시작업", "사전 도구 점검 및 준비"],
    ["검수 시 팔꿈치 압박 부상", "쿠션 제공 및 휴식 병행"],
    ["불량 제품 혼입으로 인한 클레임", "검수 기준 강화 및 이상 발생 시 즉시 보고"],
    ["제품 라벨 식별 불량으로 인한 오검수", "고해상도 확대경 사용 및 조명 각도 조정"],
    ["반복적인 손동작으로 인한 손목 통증", "손목 보호대 착용 및 중간 스트레칭"],
    ["정전기 발생으로 인한 제품 손상", "작업대 정전기 방지 패드 설치 및 방지복 착용"],
    ["먼지·이물에 의한 검수 정확도 저하", "청정작업 환경 유지 및 공정 중 청소 주기 강화"],
    ["이동 중 검수물 낙하", "양손 사용 금지 및 전용 트레이 사용"],
    ["검수물 고정 불량으로 인한 흔들림", "고정 장치 사용 및 제품 크기별 맞춤 작업대"],
    ["작업자 간 소통 부족으로 인한 혼선", "작업 시작 전 검수 기준 공유 및 인계인수 철저"],
    ["야간 검수 시 집중력 저하", "일정 조절 및 야간작업 교대제 실시"],
    ["검사 장비 미숙으로 인한 오판정", "장비 사용법 교육 주기적 실시 및 숙련도 평가"]
  ],
  ansan: [
    ["지게차 후진 시 보행자 충돌", "후진 시 클락션 울림, 감시자 배치, 보행자 출입통제"],
    ["무거운 자재 수동 운반 시 허리 부상", "리프터·대차 사용, 2인 1조 작업, 작업 전 스트레칭"],
    ["바닥 오염(기름·포장지)에 의한 미끄러짐", "작업장 청소 주기화, 미끄럼 방지 매트·표지 설치"],
    ["프레스 사용 중 손 끼임", "양수조작기 설치, 비상정지버튼, 작업 전 교육"],
    ["컨베이어 작동 중 끼임", "안전커버 설치, 작동 중 점검 금지, 비상정지버튼 설치"],
    ["전기 설비 점검 중 감전", "Lock-out/Tag-out 적용, 절연장비 착용, 점검 전 차단 확인"],
    ["공정 변경 시 작업자 미숙에 따른 사고", "변경 시 재교육 및 변경관리 절차 적용"],
    ["이동 중 스마트폰 사용으로 인한 부주의", "이동 중 휴대전화 사용 금지 캠페인"],
    ["공정 간 자재 이송 중 충돌", "이동 전 경로 확인, 지정 통로 이용, 운반장비 신호체계"],
    ["방진마스크 미착용으로 인한 호흡기 질환", "유해물질 작업 시 보호구 착용 의무화 및 점검"],
    ["반복작업으로 인한 근골격계 질환", "작업대 높이 조정, 자세 교정, 중간 휴식 제공"],
    ["비상구 주변 적치로 인한 대피 방해", "비상구 주변 1m 이내 적재 금지 및 정기 점검"],
    ["청소 작업 중 미끄럼 사고", "청소 후 바닥 건조 조치 및 주의표지 설치"],
    ["정비 중 기계 오작동으로 인한 협착", "정비 전 전원 차단 및 작동금지 표지 부착"],
    ["작업 중 의사소통 부족으로 인한 오지시", "무전기 지급, 사전 작업계획 공유, 작업 전 브리핑"]
  ],
  summer: [
    ["폭염에 의한 온열질환(열사병·열탈진)", "그늘·냉방 휴게공간 확보, 폭염특보 시 옥외작업 중지"],
    ["탈수·수분·염분 부족", "시간당 물 1컵 이상 섭취, 이온음료·소금 비치"],
    ["고온다습 환경에 의한 집중력 저하", "무더위 시간대(14~17시) 작업 조정, 충분한 휴식"],
    ["밀폐·고온 공간 열 축적에 의한 실신", "강제환기·냉방, 단독작업 금지"],
    ["이동식 냉방기 과열·화재", "필터 청소, 문어발 배선 금지"],
    ["직사광선·자외선 노출", "통풍 작업복·차양모 착용, 자외선 차단"],
    ["고온에 의한 유증기·가스 발생 증가", "환기 강화, 가스농도 수시 측정"],
    ["습기에 의한 감전 위험 증가", "누전차단기 점검, 젖은 손 전기작업 금지"],
    ["음식물 부패에 의한 식중독", "도시락·식수 위생관리 철저"],
    ["땀에 의한 미끄러짐·보호구 이탈", "미끄럼방지, 땀 흡수 보호구 사용"],
    ["전기·소방설비 과부하 정전", "부하 분산, 설비 온도 점검"],
    ["열피로 누적에 의한 오조작", "2인1조 작업, 상호 컨디션 확인"],
    ["야외 이동·상하차 중 온열질환", "작업 전후 수분 보충, 무리한 연속작업 금지"]
  ],
  winter: [
    ["한랭에 의한 저체온증·동상", "방한복·방한장갑 착용, 온열 휴게실 운영"],
    ["바닥 결빙·적설에 의한 미끄러짐·전도", "제설·제빙, 미끄럼방지 신발·매트 사용"],
    ["결로·성에에 의한 통로 미끄럼", "통로 물기 제거, 주의 표지 설치"],
    ["난방기·히터에 의한 화재", "가연물 이격, 자리 이석 시 전원 차단"],
    ["밀폐공간 난방 시 일산화탄소 중독·질식", "주기적 환기, CO 경보기 설치"],
    ["저온에 의한 근육 경직·염좌", "작업 전 충분한 준비운동, 보온"],
    ["배관·설비 동파에 의한 누수·파손", "보온재 점검, 동파 방지 열선 확인"],
    ["손 시림에 의한 공구 놓침·협착", "방한장갑 착용, 손 보온"],
    ["건조에 의한 정전기 인화·감전", "가습, 접지·본딩 실시"],
    ["결빙 고소작업 추락", "발판 결빙 제거, 안전대 체결"],
    ["노면 결빙에 의한 차량·지게차 미끄러짐", "서행, 스노체인·제설"],
    ["방한복 말림에 의한 회전체 협착", "소매·옷자락 정리, 회전기계 주의"],
    ["한랭·건조에 의한 호흡기 질환", "마스크 착용, 실내 습도 관리"]
  ]
};

/* =========================================================================
   공통 데이터베이스 레이어
   - 하나의 저장소를 사용자/관리자 페이지가 함께 읽고 씀
   - 실제 다기기 동기화가 필요하면 아래 get/set만 REST·클라우드로 교체
   ========================================================================= */
(function(){
"use strict";

const NS = "tbm.v2.";
const mem = {};
function lsGet(k, def){
  try{ const v = localStorage.getItem(NS+k); return v==null ? def : JSON.parse(v); }
  catch(e){ return (NS+k in mem) ? mem[NS+k] : def; }
}
function lsSet(k, v){
  try{ localStorage.setItem(NS+k, JSON.stringify(v)); }
  catch(e){ mem[NS+k] = v; }
}

/* ---- 원격 저장 레이어(REMOTE) : 여러 디바이스 공유 ----
   백엔드 선택: window.TBM_BACKEND = "netlify" | "supabase" (없으면 로컬)
   - netlify : Netlify Functions + Blobs (GitHub+Netlify만으로 서버·저장소 역할)
   - supabase: Supabase DB + Storage (실시간)
   설정이 없거나 실패하면 자동으로 로컬(localStorage) 모드로 동작 */
function buildRemote(){
  const W = (typeof window!=="undefined") ? window : {};
  let mode = W.TBM_BACKEND || (W.TBM_SUPABASE ? "supabase" : "local");
  if(mode==="netlify") return netlifyAdapter();
  if(mode==="supabase") return supabaseAdapter(W);
  return { enabled:false, mode:"local" };
}

/* ===== Netlify Functions + Blobs 어댑터 ===== */
function netlifyAdapter(){
  const base = "/.netlify/functions";
  const KV = ["settings","teams","accounts","custom"];
  let cache=null, pollT=null, pending={};   // pending: 로컬 저장했으나 서버 확인 전 기록(사라짐 방지)
  function setCache(c){ cache=c; }
  async function post(op, extra){
    const res = await fetch(base+"/data", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(Object.assign({op},extra))});
    if(!res.ok) throw new Error("data "+res.status);
    return res.json().catch(()=>({}));
  }
  async function loadAll(){
    const res = await fetch(base+"/data", {headers:{"Cache-Control":"no-cache"}});
    if(!res.ok) throw new Error("load "+res.status);
    const d = await res.json();
    KV.forEach(k=>{ if(d[k]!==undefined && d[k]!==null) cache[k]=d[k]; });
    // 서버 기록과 '미확정(pending)' 기록을 병합 — 방금 등록분이 사라지지 않도록
    const serverRecs = d.records || [];
    const byId = {};
    serverRecs.forEach(r=>{ if(r && r.id) byId[r.id]=r; });
    const retry = [];
    Object.keys(pending).forEach(id=>{
      const p = pending[id], sv = byId[id];
      if(sv && (sv.updatedAt||0) >= (p.updatedAt||0)){
        delete pending[id];              // 서버가 최신 반영 완료 → 확정
      }else{
        byId[id] = p;                    // 서버에 아직 없음/구버전 → 로컬본 유지
        retry.push(p);                   // 다시 전송(전송 실패/지연 보정)
      }
    });
    cache["records"] = Object.keys(byId).map(id=>byId[id]);
    retry.forEach(p=>{ post("rec",{rec:p}).catch(()=>{}); });
    if(!cache["teams"]){ cache["teams"]=seedTeams(); persist("teams",cache["teams"]); }
    if(!cache["accounts"]){ cache["accounts"]=seedAccounts(); persist("accounts",cache["accounts"]); }
    if(!cache["settings"]) cache["settings"]={};
    if(!cache["custom"]) cache["custom"]={};
    try{ ["settings","teams","accounts","custom","records"].forEach(k=>{ if(cache[k]!==undefined) lsSet(k, cache[k]); }); }catch(e){}
  }
  function persist(k,v){ if(KV.indexOf(k)<0) return; post("kv",{key:k,val:v}).catch(e=>console.warn("kv:",e)); }
  function upsertRecord(rec){ if(rec&&rec.id) pending[rec.id]=rec; post("rec",{rec:rec}).catch(e=>console.warn("rec:",e)); }
  function deleteRecord(id){ delete pending[id]; post("delRec",{id:id}).catch(e=>console.warn("delRec:",e)); }
  function pushAll(){ KV.forEach(k=>{ if(cache[k]!==undefined) persist(k,cache[k]); }); (cache["records"]||[]).forEach(upsertRecord); }
  async function clearRecords(){ try{ await post("clearRecords",{}); }catch(e){} }
  async function uploadPhoto(blob, accountId, date){
    const name=(accountId||"anon")+"_"+(date||"na")+"_"+Date.now()+"_"+Math.random().toString(36).slice(2,7)+".jpg";
    const res=await fetch(base+"/photo?name="+encodeURIComponent(name), {method:"POST", headers:{"Content-Type":"image/jpeg"}, body:blob});
    if(!res.ok) throw new Error("photo "+res.status);
    const d=await res.json(); return d.url;
  }
  function subscribe(cb){
    if(pollT) return;
    const D = (typeof document!=="undefined") ? document : null;
    const SEC = Math.max(10, (typeof window!=="undefined" && +window.TBM_SYNC_SECONDS) || 30);
    const IDLE = 10*60*1000;              // 10분간 조작 없으면 '유휴'로 판단
    let lastAct = Date.now(), ticks = 0;
    const bump = ()=>{ lastAct = Date.now(); };
    if(D){
      ["click","keydown","pointerdown","touchstart","mousemove","scroll","wheel"].forEach(ev=>{ try{ D.addEventListener(ev, bump, {passive:true}); }catch(e){} });
      try{ D.addEventListener("visibilitychange", ()=>{ if(D.visibilityState==="visible"){ bump(); cb(); } }); }catch(e){}
    }
    pollT = setInterval(()=>{
      const visible = !D || D.visibilityState===undefined || D.visibilityState==="visible";
      if(!visible) return;                                   // 탭이 숨겨지면 조회 중지(절약)
      ticks++;
      const idle = (Date.now()-lastAct) > IDLE;
      // 사용 중이면 매 주기, 유휴 시엔 4주기마다(예: 30초→2분)만 조회 → 모니터링은 계속되되 절약
      if(!idle || (ticks % 4 === 0)) cb();
    }, SEC*1000);
  }
  return { enabled:true, mode:"netlify", setCache, persist, loadAll, upsertRecord, deleteRecord, pushAll, clearRecords, uploadPhoto, subscribe };
}

/* ===== Supabase 어댑터 ===== */
function supabaseAdapter(W){
  const cfg = W.TBM_SUPABASE || null;
  const hasLib = !!(W.supabase && W.supabase.createClient);
  const ok = !!(cfg && cfg.url && cfg.anonKey && !/YOUR_|여기에|example|\.\.\./i.test(String(cfg.url)+String(cfg.anonKey)) && hasLib);
  let sb=null, cache=null, pending={};
  if(ok){ try{ sb = W.supabase.createClient(cfg.url, cfg.anonKey); }catch(e){ sb=null; } }
  const enabled = ok && !!sb;
  const bucket = (cfg && cfg.bucket) || "tbm-photos";
  const KV = ["settings","teams","accounts","custom"];
  function setCache(c){ cache=c; }
  function persist(k,v){ if(!enabled||KV.indexOf(k)<0) return;
    sb.from("tbm_kv").upsert({key:k,val:v,updated_at:new Date().toISOString()}).then(r=>{if(r&&r.error)console.warn("kv:",r.error.message);}).catch(e=>console.warn("kv:",e)); }
  async function loadAll(){
    const kv=await sb.from("tbm_kv").select("key,val"); if(kv.error) throw kv.error;
    (kv.data||[]).forEach(row=>{ cache[row.key]=row.val; });
    const rc=await sb.from("tbm_records").select("data").order("date",{ascending:true}); if(rc.error) throw rc.error;
    const serverRecs=(rc.data||[]).map(r=>r.data);
    const byId={}; serverRecs.forEach(r=>{ if(r&&r.id) byId[r.id]=r; });
    const retry=[];
    Object.keys(pending).forEach(id=>{ const p=pending[id], sv=byId[id];
      if(sv && (sv.updatedAt||0)>=(p.updatedAt||0)){ delete pending[id]; }
      else { byId[id]=p; retry.push(p); } });
    cache["records"]=Object.keys(byId).map(id=>byId[id]);
    retry.forEach(upsertRecord);
    if(!cache["teams"]){ cache["teams"]=seedTeams(); persist("teams",cache["teams"]); }
    if(!cache["accounts"]){ cache["accounts"]=seedAccounts(); persist("accounts",cache["accounts"]); }
    if(!cache["settings"]) cache["settings"]={}; if(!cache["custom"]) cache["custom"]={};
    try{ ["settings","teams","accounts","custom","records"].forEach(k=>{ if(cache[k]!==undefined) lsSet(k, cache[k]); }); }catch(e){}
  }
  function upsertRecord(rec){ if(!enabled) return; if(rec&&rec.id) pending[rec.id]=rec;
    sb.from("tbm_records").upsert({id:rec.id,account_id:rec.accountId||null,date:rec.date,data:rec,updated_at:new Date().toISOString()}).then(r=>{if(r&&r.error)console.warn("rec:",r.error.message);}).catch(e=>console.warn("rec:",e)); }
  function deleteRecord(id){ if(!enabled) return; delete pending[id]; sb.from("tbm_records").delete().eq("id",id).then(r=>{if(r&&r.error)console.warn(r.error.message);}).catch(e=>console.warn(e)); }
  function pushAll(){ if(!enabled) return; KV.forEach(k=>{ if(cache[k]!==undefined) persist(k,cache[k]); }); (cache["records"]||[]).forEach(upsertRecord); }
  async function clearRecords(){ if(enabled){ try{ await sb.from("tbm_records").delete().neq("id","___none___"); }catch(e){} } }
  async function uploadPhoto(blob, accountId, date){
    const path=(accountId||"anon")+"/"+(date||"na")+"/"+Date.now()+"_"+Math.random().toString(36).slice(2,7)+".jpg";
    const up=await sb.storage.from(bucket).upload(path,blob,{contentType:"image/jpeg",upsert:false}); if(up.error) throw up.error;
    return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
  function subscribe(cb){ if(!enabled) return; try{
    sb.channel("tbm-sync").on("postgres_changes",{event:"*",schema:"public",table:"tbm_kv"},cb).on("postgres_changes",{event:"*",schema:"public",table:"tbm_records"},cb).subscribe();
  }catch(e){ console.warn("realtime:",e); } }
  return { enabled, mode:"supabase", setCache, persist, loadAll, upsertRecord, deleteRecord, pushAll, clearRecords, uploadPhoto, subscribe };
}

const REMOTE = buildRemote();

/* 저장소 선택 */
let raw;
if(REMOTE.enabled){
  const cache = {};
  REMOTE.setCache(cache);
  raw = {
    _cache: cache,
    get(k, def){ if(k==="session") return lsGet(k,def); return (k in cache) ? cache[k] : def; },
    set(k, v){
      if(k==="session"){ lsSet(k,v); return; }
      cache[k]=v;
      lsSet(k, v);          // 로컬에도 함께 저장(서버 연결 실패 시 유실 방지)
      REMOTE.persist(k, v); // 서버에 반영(records는 행 단위로 별도 처리)
    }
  };
} else {
  raw = { get: lsGet, set: lsSet };
}
/* 서버 연결 실패 시 로컬 저장본으로 캐시 복구 */
function hydrateCacheFromLocal(){
  if(!raw._cache) return;
  ["settings","teams","accounts","custom","records"].forEach(k=>{
    const v = lsGet(k, undefined);
    if(v!==undefined && raw._cache[k]===undefined) raw._cache[k]=v;
  });
}
/* 서버에서 받아온 최신 데이터를 로컬에도 저장 → 새로고침/오프라인 재접속 시 최신본 유지 */
function mirrorCacheToLocal(){
  if(!raw._cache) return;
  ["settings","teams","accounts","custom","records"].forEach(k=>{
    if(raw._cache[k]!==undefined){ try{ lsSet(k, raw._cache[k]); }catch(e){} }
  });
}

const DEFAULT_SETTINGS = {
  orgName: "",
  halfTargetHours: 12,     // 반기 목표 교육시간(시간)
  sessionMinutes: 10,      // 1회 TBM 인정 시간(분)
  workdays: [1,2,3,4,5],   // 근무요일 (0=일 ~ 6=토)
  seasonDefaultOn: true,   // 계절 특별관리 자동 포함 기본값
  countPastOnly: true      // 오늘 이후 미실시는 '예정'으로 표시
};

function seedTeams(){
  return TBM_DB.categories.filter(c=>c.type==="dept").map(c=>({
    id: c.id, name: c.name, contentCat: c.id
  }));
}

/* 간단 비밀번호 해시 (오프라인 로컬 저장용 · 암호학적 보안 아님) */
function hashPw(str){
  let s = "tbm§v2§" + String(str), h = 5381;
  for(let i=0;i<s.length;i++){ h = (((h<<5)+h) ^ s.charCodeAt(i)) | 0; }
  return "h" + (h>>>0).toString(36);
}
function seedAccounts(){
  return [{
    id:"admin", username:"admin", pass:hashPw("admin1234"),
    name:"안전보건담당자", teamId:null, role:"admin",
    targetHours:null, active:true, createdAt:Date.now()
  }];
}
/* 기존(계정 이전) 기록에 accountId 부여 — 부서별 대표 관리감독자 계정 자동 생성 */
function migrateRecords(accounts){
  const recs = raw.get("records", []); if(!recs.length) return;
  let changed=false; const madeFor={};
  recs.forEach(r=>{
    if(r.accountId) return;
    const tid = r.teamId || "common";
    let accId = madeFor[tid];
    if(!accId){
      let ex = accounts.find(a=>a.role==="user" && a.teamId===tid);
      if(!ex){
        const tm = (raw.get("teams",null)||seedTeams()).find(t=>t.id===tid);
        ex = { id:"a_"+tid, username:tid, pass:hashPw("tbm1234"),
               name:(r.supervisor||((tm?tm.name:tid)+" 관리감독자")), teamId:tid, role:"user",
               targetHours:null, active:true, createdAt:(r.createdAt||Date.now()) };
        accounts.push(ex);
      }
      accId = ex.id; madeFor[tid]=accId;
    }
    r.accountId = accId; changed=true;
  });
  if(changed){ raw.set("accounts",accounts); raw.set("records",recs); }
}

const DB = {
  settings(){ return Object.assign({}, DEFAULT_SETTINGS, raw.get("settings", {})); },
  saveSettings(s){ raw.set("settings", s); },

  teams(){ let t = raw.get("teams", null); if(!t){ t = seedTeams(); raw.set("teams", t); } return t; },
  saveTeams(t){ raw.set("teams", t); },
  team(id){ return this.teams().find(t=>t.id===id); },

  /* ---- 계정(로그인) ---- */
  accounts(){ let a = raw.get("accounts", null); if(!a){ a = seedAccounts(); raw.set("accounts", a); migrateRecords(a); a = raw.get("accounts", a); } return a; },
  saveAccounts(a){ raw.set("accounts", a); },
  account(id){ return this.accounts().find(a=>a.id===id); },
  userAccounts(){ return this.accounts().filter(a=>a.role==="user"); },
  accountByUser(u){ u=String(u||"").trim().toLowerCase(); return this.accounts().find(a=>String(a.username).toLowerCase()===u); },
  verify(u,p){ const a=this.accountByUser(u); return (a && a.active && a.pass===hashPw(p)) ? a : null; },
  addAccount(acc){ const a=this.accounts(); a.push(Object.assign({id:"a"+Date.now()+Math.random().toString(36).slice(2,5),createdAt:Date.now(),active:true,targetHours:null,role:"user"},acc)); this.saveAccounts(a); return a; },
  updateAccount(id,patch){ const a=this.accounts(); const i=a.findIndex(x=>x.id===id); if(i>=0){ a[i]=Object.assign({},a[i],patch); this.saveAccounts(a); } return a; },
  delAccount(id){ this.saveAccounts(this.accounts().filter(a=>a.id!==id)); },

  records(){ return raw.get("records", []); },
  saveRecords(r){ raw.set("records", r); },
  addRecord(rec){
    const list = this.records();
    // 같은 날짜·같은 관리감독자 기록이 있으면 덮어쓰기(1일 1TBM 원칙)
    const i = list.findIndex(x=>x.date===rec.date && x.accountId===rec.accountId);
    let saved;
    if(i>=0){ saved = Object.assign({}, list[i], rec, {updatedAt:Date.now()}); list[i]=saved; }
    else { saved = Object.assign({id:"r"+Date.now()+Math.random().toString(36).slice(2,6), createdAt:Date.now(), updatedAt:Date.now()}, rec); list.push(saved); }
    this.saveRecords(list);
    if(REMOTE.enabled) REMOTE.upsertRecord(saved);
    return list;
  },
  delRecord(id){ this.saveRecords(this.records().filter(x=>x.id!==id)); if(REMOTE.enabled) REMOTE.deleteRecord(id); },
  recordFor(accId, date){ return this.records().find(x=>x.accountId===accId && x.date===date); },
  recordsDoneOn(date){ // 해당 날짜 실시한 관리감독자 accountId 집합
    const set=new Set(); this.records().forEach(r=>{ if(r.date===date) set.add(r.accountId); }); return set;
  },

  custom(){ return raw.get("custom", {}); },
  saveCustom(c){ raw.set("custom", c); },

  session(){ return raw.get("session", null); },
  saveSession(s){ raw.set("session", s); },
  clearSession(){ raw.set("session", null); },

  exportAll(){
    return JSON.stringify({
      _app:"TBM-통합관리", _v:2, _at:new Date().toISOString(),
      settings: raw.get("settings",{}), teams: this.teams(), accounts: this.accounts(),
      records: this.records(), custom: this.custom()
    }, null, 2);
  },
  importAll(json){
    const d = JSON.parse(json);
    if(d.settings) raw.set("settings", d.settings);
    if(d.teams) raw.set("teams", d.teams);
    if(d.accounts) raw.set("accounts", d.accounts);
    if(d.records) raw.set("records", d.records);
    if(d.custom) raw.set("custom", d.custom);
    if(REMOTE.enabled) REMOTE.clearRecords().then(()=>REMOTE.pushAll());
  },
  resetAll(){
    raw.set("settings",{}); raw.set("teams",seedTeams()); raw.set("accounts",seedAccounts());
    raw.set("records",[]); raw.set("custom",{});
    if(REMOTE.enabled) REMOTE.clearRecords().then(()=>REMOTE.pushAll());
  }
};

/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s==null?"":s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; };
const DOW = ["일","월","화","수","목","금","토"];
const pad2 = n => String(n).padStart(2,"0");
const ymd = d => d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate());
const parseYmd = s => { const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); };
const todayYmd = () => ymd(new Date());
const fmtK = s => { const d=parseYmd(s); return (d.getMonth()+1)+"월 "+d.getDate()+"일("+DOW[d.getDay()]+")"; };
const sameDay = (a,b)=> a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();

function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove("show"),2200);
}
function seasonOf(month){ if([6,7,8].includes(month))return "summer"; if([12,1].includes(month))return "winter"; return null; }
function seasonLabel(s){ return s==="summer"?"혹서기":s==="winter"?"혹한기":""; }

/* 반기 계산: 상반기 1/1~6/30, 하반기 7/1~12/31 */
function halfOf(date){
  const y=date.getFullYear(), m=date.getMonth()+1;
  if(m<=6) return {y, h:1, label:"상반기", start:new Date(y,0,1), end:new Date(y,5,30), key:y+"-H1"};
  return {y, h:2, label:"하반기", start:new Date(y,6,1), end:new Date(y,11,31), key:y+"-H2"};
}
function halfByKey(key){
  const [y,h]=key.split("-"); const yy=+y;
  return h==="H1" ? {y:yy,h:1,label:"상반기",start:new Date(yy,0,1),end:new Date(yy,5,30),key} 
                  : {y:yy,h:2,label:"하반기",start:new Date(yy,6,1),end:new Date(yy,11,31),key};
}
function workdaysInRange(start, end, workdays){
  const out=[]; const d=new Date(start); const e=new Date(end);
  while(d<=e){ if(workdays.includes(d.getDay())) out.push(ymd(d)); d.setDate(d.getDate()+1); }
  return out;
}
function round1(n){ return Math.round(n*10)/10; }
function ring(pct){
  const p=Math.max(0,Math.min(100,Math.round(pct||0)));
  const R=20, C=2*Math.PI*R, off=(C*(1-p/100));
  const col=p>=100?'var(--safe)':p>=60?'var(--safe)':p>=30?'var(--amber)':'var(--danger)';
  return `<svg class="ring" viewBox="0 0 48 48" width="54" height="54" aria-hidden="true">`+
    `<g transform="rotate(-90 24 24)"><circle class="rbg" cx="24" cy="24" r="${R}"/>`+
    `<circle class="rfg" cx="24" cy="24" r="${R}" stroke="${col}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></g>`+
    `<text class="rtx" x="24" y="25" text-anchor="middle">${p}</text>`+
    `<text class="rts" x="24" y="33" text-anchor="middle">%</text></svg>`;
}

/* ---------- Custom content ---------- */
function customFor(cat){ return (DB.custom()[cat])||[]; }
function itemsFor(cat){
  const seed=(TBM_DB[cat]||[]).map(p=>({h:p[0],m:p[1],seed:true}));
  const cus=customFor(cat).map(p=>({h:p[0],m:p[1],seed:false}));
  return seed.concat(cus);
}
function poolWithCustom(cat){ return itemsFor(cat).map(x=>({h:x.h,m:x.m})); }

/* ---------- 자동생성 엔진 ---------- */
function buildPool(contentCat){
  let base;
  if(contentCat==="all"){
    base=[];
    TBM_DB.categories.filter(c=>c.type==="dept").forEach(c=>{
      poolWithCustom(c.id).forEach(x=>base.push({h:x.h,m:x.m,src:"dept"}));
    });
  }else{
    base=poolWithCustom(contentCat).map(x=>({h:x.h,m:x.m,src:"dept"}));
  }
  const common=poolWithCustom("common").map(x=>({h:x.h,m:x.m,src:"common"}));
  return shuffle(base.concat(common));
}
function draw(arr, used){
  if(!arr.length) return {h:"",m:"",src:"common"};
  let pick=arr.find(x=>!used.has(x.h));
  if(!pick){ used.clear(); pick=arr[(Math.random()*arr.length)|0]; }
  used.add(pick.h); return {h:pick.h, m:pick.m, src:pick.src};
}
/* 하루치(위험요인 3 + 대책 3) 생성 */
function genDay(contentCat, month, seasonOn){
  const season = seasonOn ? seasonOf(month) : null;
  const pool = buildPool(contentCat);
  const seasonPool = season ? shuffle(poolWithCustom(season).map(x=>({h:x.h,m:x.m,src:season}))) : [];
  const used=new Set(), usedS=new Set();
  const items=[];
  for(let s=0;s<3;s++){
    if(season && s===0) items.push(draw(seasonPool, usedS));
    else items.push(draw(pool, used));
  }
  return items;
}
function regenOne(contentCat, month, seasonOn, current, idx){
  const season = seasonOn ? seasonOf(month) : null;
  const used=new Set(current.map(x=>x.h));
  const cell=current[idx];
  let arr;
  if(cell && (cell.src==="summer"||cell.src==="winter")) arr=shuffle(poolWithCustom(cell.src).map(x=>({h:x.h,m:x.m,src:cell.src})));
  else if(season && idx===0) arr=shuffle(poolWithCustom(season).map(x=>({h:x.h,m:x.m,src:season})));
  else arr=buildPool(contentCat);
  return draw(arr, used);
}

/* =========================================================================
   애플리케이션 상태 & 라우팅
   ========================================================================= */
const state = {
  role: null,            // 'user' | 'admin'
  account: null,         // 로그인한 계정 객체
  teamId: null,          // 사용자(관리감독자) 소속 부서
  userTab: "register",
  adminTab: "dashboard",
  // 등록 화면 임시 상태
  reg: { date: todayYmd(), items: null, seasonOn: DB.settings().seasonDefaultOn, minutes: DB.settings().sessionMinutes, attendees:"", note:"", photos:[] },
  // 캘린더
  calY: new Date().getFullYear(), calM: new Date().getMonth()+1,
  calTeam: "all",
  // 콘텐츠 관리
  cmCat: "material", cmSearch: "",
  // 관리자 대시보드 반기
  halfKey: halfOf(new Date()).key,
  // 기록 열람 필터
  recTeam: "all", recDept:"all", recSeason:"all", recSort:"desc", recFrom:"", recTo:"", recSearch:""
};

/* =========================================================================
   렌더링 — 공통 셸
   ========================================================================= */
function roleName(r){ return r==="admin" ? "안전보건담당자" : "관리감독자"; }

const NAVICON={
  dashboard:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`,
  daily:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="M9 15l2 2 4-4"/></svg>`,
  records:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>`,
  accounts:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  content:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 3v3h6V3M8 11h8M8 15h6"/></svg>`,
  settings:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 1 1-2.83 2.83l-.05-.06a1.7 1.7 0 0 0-2.87 1.2V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-2.87-1.2l-.05.06a2 2 0 1 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 13.5H4.5a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.87l-.06-.05a2 2 0 1 1 2.83-2.83l.05.06A1.7 1.7 0 0 0 10.5 4.6V4.5a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.87 1.2l.05-.06a2 2 0 1 1 2.83 2.83l-.06.05a1.7 1.7 0 0 0 1.2 2.87h.1a2 2 0 1 1 0 4h-.09z"/></svg>`,
  help:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3M12 17h.01"/></svg>`,
  register:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>`,
  status:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-6"/></svg>`
};

function shell(){
  const s = DB.settings();
  const acc = state.account;
  const who = state.role==="user"
    ? (DB.team(state.teamId)?.name || "미지정") + (acc?.name ? " · "+acc.name : "")
    : (s.orgName ? s.orgName+" · " : "") + (acc?.name || "안전보건 관리자");
  const nav = state.role==="admin" ? [
    ["dashboard","대시보드"],["daily","일별 점검"],["records","기록 열람"],
    ["accounts","계정 관리"],["content","교육콘텐츠"],["settings","설정"],["help","사용안내"]
  ] : [
    ["register","TBM 등록"],["status","내 현황"],["content","교육콘텐츠"],["help","사용안내"]
  ];
  const cur = state.role==="admin" ? state.adminTab : state.userTab;
  return `
  <div class="topbar"><div class="wrap">
    <div class="brand">
      <div><small>제조업 안전보건 · Tool Box Meeting</small><h1>TBM 통합관리 시스템</h1></div></div>
    <div class="spacer"></div>
    <span class="sync-badge ${REMOTE.enabled&&!REMOTE.degraded?'on':''} ${REMOTE.degraded?'warn':''} no-print" title="${REMOTE.enabled?(REMOTE.degraded?'서버에 연결하지 못함 — 이 기기에만 저장 중':'여러 디바이스 공유 사용 중 ('+REMOTE.mode+')'):'이 기기에만 저장(로컬)'}">${!REMOTE.enabled?'&#9679; 로컬':(REMOTE.degraded?'&#9888; 서버 미연결':(REMOTE.mode==='supabase'?'&#9729; 실시간 공유':'&#9729; 공유'))}</span>
    ${REMOTE.enabled?'<button class="tb-btn no-print" data-act="syncNow" title="지금 서버에서 최신 데이터 불러오기">&#8635; 새로고침</button>':''}
    <span class="who no-print">${esc(who)}</span>
    <span class="role-pill ${state.role==='admin'?'admin':''}"><span class="dot"></span>${roleName(state.role)}</span>
    <button class="tb-btn no-print" data-act="logout" title="로그아웃">⏻ 로그아웃</button>
  </div></div>
  <nav class="nav no-print"><div class="wrap">
    ${nav.map(([id,label])=>`<button data-tab="${id}" class="${cur===id?'on':''}">${NAVICON[id]||""}${label}</button>`).join("")}
  </div></nav>
  <div class="page"><div id="viewhost"></div></div>`;
}

function mount(){
  if(!state.role || !state.account){ renderLogin(); $("#gate").classList.remove("hide"); return; }
  $("#gate").classList.add("hide");
  $("#app").innerHTML = shell();
  renderView();
}

function renderView(){
  const host = $("#viewhost");
  if(!host) return;
  try{
  if(state.role==="admin"){
    if(state.adminTab==="dashboard") host.innerHTML = viewDashboard();
    else if(state.adminTab==="daily") host.innerHTML = viewDaily();
    else if(state.adminTab==="records") host.innerHTML = viewRecords();
    else if(state.adminTab==="accounts") host.innerHTML = viewAccounts();
    else if(state.adminTab==="settings") host.innerHTML = viewSettings();
    else if(state.adminTab==="content") host.innerHTML = viewContent();
    else if(state.adminTab==="help") host.innerHTML = viewHelp();
  }else{
    if(state.userTab==="register"){ ensureRegItems(); host.innerHTML = viewRegister(); }
    else if(state.userTab==="status") host.innerHTML = viewStatus();
    else if(state.userTab==="content") host.innerHTML = viewContent();
    else if(state.userTab==="help") host.innerHTML = viewHelp();
  }
  }catch(err){
    if(typeof console!=="undefined") console.error(err);
    host.innerHTML = `<div class="panel"><div class="bd"><div class="empty"><div class="big">화면 표시 중 오류가 발생했습니다</div>${esc(err&&err.message||err)}<br><br>새로고침 후 다시 시도하거나, 문제가 계속되면 데이터를 내보내기 하여 백업하세요.</div></div></div>`;
  }
}

/* =========================================================================
   로그인 화면
   ========================================================================= */
function renderLogin(){
  const onlyDefault = DB.accounts().length===1; // 최초 상태(admin만)
  const org = (DB.settings().orgName||"").trim();
  $("#gate").innerHTML = `
  <div class="gate-card login">
    ${org?`<div class="org-name">${esc(org)}</div>`:""}
    <h2>TBM 통합관리 시스템</h2>
    <p>${org?esc(org)+" · ":""}작업 전 안전점검회의(Tool Box Meeting) 통합관리<br>계정으로 로그인하세요.</p>
    <div class="login-form">
      <div class="field"><label>아이디</label>
        <input type="text" id="loginUser" autocomplete="username" placeholder="아이디" autofocus></div>
      <div class="field"><label>비밀번호</label>
        <input type="password" id="loginPw" autocomplete="current-password" placeholder="비밀번호"></div>
      <button class="btn primary block lg" data-act="login">로그인</button>
      <div id="loginErr" class="login-err"></div>
    </div>
    ${onlyDefault?`<div class="login-hint">최초 관리자 계정 — 아이디 <b>admin</b> · 비밀번호 <b>admin1234</b><br>로그인 후 <b>설정</b>에서 사업장명을 입력하고, <b>계정 관리</b>에서 관리감독자 계정을 추가하세요.</div>`:`<div class="gate-foot">${org?esc(org)+" · ":""}TBM MANAGEMENT · v2.0</div>`}
  </div>`;
}
function doLogin(){
  const u=$("#loginUser").value.trim(), p=$("#loginPw").value;
  const acc=DB.verify(u,p);
  if(!acc){ const e=$("#loginErr"); if(e){ e.textContent="아이디 또는 비밀번호가 올바르지 않거나 비활성화된 계정입니다."; } return; }
  state.account=acc; state.role=acc.role; state.teamId=acc.teamId;
  if(acc.role==="admin") state.adminTab="dashboard";
  else { state.userTab="register"; state.reg.items=null; state.reg.date=todayYmd(); }
  DB.saveSession({accountId:acc.id});
  closeModal(); mount();
}

/* =========================================================================
   사용자 페이지 — TBM 등록
   ========================================================================= */
function ensureRegItems(){
  if(!state.reg.items){
    const ex = DB.recordFor(state.account.id, state.reg.date);
    if(ex){
      state.reg.items = JSON.parse(JSON.stringify(ex.items||[]));
      state.reg.minutes = ex.durationMin || DB.settings().sessionMinutes;
      state.reg.attendees = ex.attendees||""; state.reg.note = ex.note||"";
      state.reg.photos = Array.isArray(ex.photos)? ex.photos.slice() : [];
      if(ex.season) state.reg.seasonOn = true;
    }else{
      const team = DB.team(state.teamId);
      const cat = team? team.contentCat : "all";
      state.reg.items = genDay(cat, parseYmd(state.reg.date).getMonth()+1, state.reg.seasonOn);
    }
  }
}

function viewRegister(){
  const team = DB.team(state.teamId);
  const s = DB.settings();
  const date = state.reg.date;
  const dObj = parseYmd(date);
  const month = dObj.getMonth()+1;
  const season = seasonOf(month);
  const existing = DB.recordFor(state.account.id, date);
  const isWorkday = s.workdays.includes(dObj.getDay());
  const items = state.reg.items || [];
  const srcMap={dept:["dept","부서"],common:["common","공통"],summer:["summer","혹서기"],winter:["winter","혹한기"]};

  const seasonBox = season ? `
    <div class="season-note"><div class="season ${season}">
      <div class="ic">${season==="summer"?"☀":"❄"}</div>
      <div><b>${seasonLabel(season)} 특별안전관리</b> — ${season==="summer"?"폭염·온열질환":"한랭·결빙"} 예방 항목이 매일 1건 자동 포함됩니다.</div>
      <label class="toggle">포함<span class="switch"><input type="checkbox" data-act="regSeason" ${state.reg.seasonOn?"checked":""}><span></span></span></label>
    </div></div>` : `
    <div class="season-note"><div class="season none"><div class="ic">·</div>
      <div>${month}월은 계절 특별관리 대상 기간이 아닙니다. 부서·공통 항목으로 생성됩니다.</div></div></div>`;

  return `
  <div class="panel no-print">
    <div class="hd"><span class="eyebrow">STEP 1</span><h2>TBM 등록 · 날짜 선택</h2>
      <span class="chip ${existing?'done':'wait'}" style="margin-left:auto">${existing?"✔ 등록됨(수정 가능)":"미등록"}</span></div>
    <div class="bd">
      <div class="ctrl-grid">
        <div class="field"><label>실시 날짜</label><input type="date" data-f="regDate" value="${date}" max="${todayYmd()}"></div>
        <div class="field"><label>소속 부서</label>
          <input type="text" value="${esc(team?team.name:'')}" disabled></div>
        <div class="field"><label>교육시간(분)</label>
          <input type="number" min="1" max="120" data-f="regMin" value="${state.reg.minutes}">
          <span class="hint">기본값 ${s.sessionMinutes}분 · 관리자 설정</span></div>
        <div class="field"><button class="btn primary" style="height:40px" data-act="regGen">⚙ 교육내용 자동생성</button></div>
      </div>
      ${!isWorkday?`<div class="note" style="margin-top:12px">선택한 날짜(${DOW[dObj.getDay()]}요일)는 관리자 설정상 <b>근무요일이 아닙니다.</b> 필요 시 등록은 가능하나 진행여부 통계에는 반영되지 않습니다.</div>`:""}
      ${seasonBox}
    </div>
  </div>

  <div class="panel">
    <div class="hd"><span class="eyebrow">STEP 2</span><h2>${fmtK(date)} · ${esc(team?team.name:'')} TBM</h2>
      <div class="btn-row no-print" style="margin-left:auto">
        <button class="btn sm" data-act="regGen">⟳ 전체 재생성</button>
        <button class="btn sm" data-act="regPrint">🖨 인쇄</button>
      </div></div>
    <div class="bd">
      <div id="regItems" class="reg-daybox">
        ${items.map((it,i)=>`
          <div class="reg-item">
            <button class="btn sm ghost regen no-print" data-act="regRegen" data-i="${i}" title="이 항목 재생성">⟳ 재생성</button>
            <div class="lab"><span class="num">${i+1}</span><span class="t">위험요인</span>
              <span class="src ${(srcMap[it.src]||srcMap.common)[0]}">${(srcMap[it.src]||srcMap.common)[1]}</span></div>
            <textarea data-ri="${i}" data-rk="h" rows="2">${esc(it.h)}</textarea>
            <div class="m-lab">↳ 위험방지대책</div>
            <textarea data-ri="${i}" data-rk="m" rows="2">${esc(it.m)}</textarea>
          </div>`).join("")}
      </div>
      <div class="divider"></div>
      <div class="ctrl-grid" style="grid-template-columns:1fr 1fr">
        <div class="field"><label>참석자 <span class="req">* 필수</span></label>
          <input type="text" data-f="regAtt" value="${esc(state.reg.attendees)}" placeholder="예) 홍길동, 김철수 외 3명" required></div>
        <div class="field"><label>특이사항·비고 <span class="subtle">(선택)</span></label>
          <input type="text" data-f="regNote" value="${esc(state.reg.note)}" placeholder="현장 특이사항 입력"></div>
      </div>
      <div class="field" style="margin-top:14px">
        <label>현장 사진 <span class="subtle">(선택 · 최대 6장 · 자동 압축 저장)</span></label>
        <div class="photo-grid">
          ${(state.reg.photos||[]).map((src,i)=>`<div class="photo-thumb"><img src="${src}" alt="현장 사진 ${i+1}"><button class="photo-del no-print" data-act="regPhotoDel" data-i="${i}" title="사진 삭제">×</button></div>`).join("")}
          <label class="photo-add no-print"><span>＋</span>사진 추가
            <input type="file" id="regPhotoInput" accept="image/*" multiple capture="environment" style="display:none"></label>
        </div>
        <span class="hint">카메라 촬영 또는 갤러리에서 선택할 수 있습니다. 사진은 자동 압축되어 저장되며, 관리자 페이지에서 확인됩니다.</span>
      </div>
      <div class="btn-row no-print" style="margin-top:16px">
        <button class="btn primary lg" data-act="regSave">${existing?"💾 수정 저장":"💾 TBM 등록"}</button>
        ${existing?`<button class="btn danger" data-act="regDelete">등록 취소(삭제)</button>`:""}
      </div>
    </div>
  </div>`;
}

/* 등록 화면 재렌더(입력 포커스 보존 위해 items 영역만 갱신) */
function renderRegItems(){
  const host=$("#regItems"); if(!host)return;
  const items=state.reg.items||[];
  const srcMap={dept:["dept","부서"],common:["common","공통"],summer:["summer","혹서기"],winter:["winter","혹한기"]};
  host.innerHTML=items.map((it,i)=>`
    <div class="reg-item">
      <button class="btn sm ghost regen no-print" data-act="regRegen" data-i="${i}" title="이 항목 재생성">⟳ 재생성</button>
      <div class="lab"><span class="num">${i+1}</span><span class="t">위험요인</span>
        <span class="src ${(srcMap[it.src]||srcMap.common)[0]}">${(srcMap[it.src]||srcMap.common)[1]}</span></div>
      <textarea data-ri="${i}" data-rk="h" rows="2">${esc(it.h)}</textarea>
      <div class="m-lab">↳ 위험방지대책</div>
      <textarea data-ri="${i}" data-rk="m" rows="2">${esc(it.m)}</textarea>
    </div>`).join("");
}

/* =========================================================================
   사용자 페이지 — 내 현황 (진행 캘린더 + 반기 목표)
   ========================================================================= */
function viewStatus(){
  const half = halfOf(new Date());
  const c = computeAcc(state.account.id, half);
  const team = DB.team(state.teamId);
  const barCls = c.pct>=100?"over":c.pct>=60?"":c.pct>=30?"low":"crit";
  return `
  <div class="panel">
    <div class="hd"><span class="eyebrow">MY STATUS</span><h2>${esc(state.account.name)} · ${esc(team?team.name:'')} · ${half.y} ${half.label}</h2></div>
    <div class="bd">
      <div class="stat-row" style="margin-bottom:18px">
        <div class="stat good"><div class="k">누적 교육시간</div><div class="v">${round1(c.accHours)}<small>h</small></div><div class="sub">전체 ${c.done}회 실시</div></div>
        <div class="stat"><div class="k">반기 목표시간</div><div class="v">${c.target}<small>h</small></div><div class="sub">달성률 ${Math.round(c.pct)}%</div></div>
        <div class="stat amber"><div class="k">잔여 시간</div><div class="v">${round1(c.remaining)}<small>h</small></div><div class="sub">${c.remaining>0?"목표까지 남음":"목표 달성 완료"}</div></div>
        <div class="stat ${c.missed>0?'bad':'good'}"><div class="k">미실시 일수</div><div class="v">${c.missed}<small>일</small></div><div class="sub">근무일 ${c.elapsed}일 중</div></div>
      </div>
      <div class="progress"><div class="fill ${barCls}" style="width:${Math.min(100,c.pct)}%"></div></div>
      <div class="prog-meta"><span>${round1(c.accHours)}h 완료</span><span class="pct">${Math.round(c.pct)}% · 목표 ${c.target}h</span></div>
    </div>
  </div>
  <div class="panel">
    <div class="hd"><span class="eyebrow">CALENDAR</span><h2>일별 TBM 실시 현황</h2></div>
    <div class="bd">${calendarBlock(state.account.id)}</div>
  </div>`;
}

/* =========================================================================
   공통 — 월 캘린더 블록
   ========================================================================= */
function adoptionDate(){
  const recs=DB.records(); if(!recs.length) return null;
  return recs.reduce((min,r)=> r.date<min?r.date:min, recs[0].date);
}
/* 이 계정의 '도입 시작일' = 이 계정의 가장 이른 등록일(없으면 null). 이 날 이전 근무일은 집계 대상 아님 */
function acctStartYmd(acc){
  const id=acc&&acc.id; if(!id) return null;
  const recs=DB.records().filter(r=>r.accountId===id);
  if(!recs.length) return null;
  return recs.reduce((min,r)=> r.date<min?r.date:min, recs[0].date);
}
function computeAcc(accId, half){
  const s=DB.settings();
  const acc=DB.account(accId);
  const target = (acc && acc.targetHours!=null && acc.targetHours!=="") ? +acc.targetHours : s.halfTargetHours;
  const allWd = workdaysInRange(half.start, half.end, s.workdays);
  const today=new Date(); const cutoff = today<half.end?today:half.end;
  const cutoffYmd = ymd(cutoff);
  // 집계 시작일 = 이 계정의 첫 등록일(그 이전 근무일은 미실시로 세지 않음)
  const startY = acctStartYmd(acc);
  const effStart = new Date(half.start);
  if(startY){ const sd=parseYmd(startY); if(sd>effStart) effStart.setTime(sd.getTime()); }
  const elapsed = startY ? workdaysInRange(effStart, cutoff, s.workdays) : [];
  const recs = DB.records().filter(r=>r.accountId===accId && r.date>=ymd(half.start) && r.date<=ymd(half.end));
  const doneDates = new Set(recs.map(r=>r.date));
  // 실시(회): 이 계정이 반기 내 오늘까지 실제로 등록한 TBM 일수(미래 등록은 예정으로 제외)
  const done = new Set(recs.filter(r=>r.date<=cutoffYmd).map(r=>r.date)).size;
  // 미실시(일): 도입일 이후 오늘까지의 근무일 중 기록이 없는 날
  const missedDates = elapsed.filter(d=>!doneDates.has(d));
  const accMin = recs.reduce((a,r)=>a+(+r.durationMin||0),0);
  const accHours = accMin/60;
  const remaining = Math.max(0, target-accHours);
  const pct = target>0? accHours/target*100 : 0;
  return {accId, totalWorkdays:allWd.length, elapsed:elapsed.length, done, missed:missedDates.length, missedDates, accHours, target, remaining, pct, recs, doneDates};
}

function calendarBlock(accId){
  const y=state.calY, m=state.calM, s=DB.settings();
  const today=todayYmd();
  const start=acctStartYmd(DB.account(accId));
  const dowHead=DOW.map((d,i)=>`<div class="cal-dow ${i===0?'sun':i===6?'sat':''}">${d}</div>`).join("");
  const first=new Date(y,m-1,1), startPad=first.getDay(), days=new Date(y,m,0).getDate();
  let cells="";
  for(let i=0;i<startPad;i++) cells+=`<div class="cal-cell pad"></div>`;
  for(let d=1;d<=days;d++){
    const dt=new Date(y,m-1,d), key=ymd(dt), dow=dt.getDay();
    const isWd=s.workdays.includes(dow);
    const rec=DB.recordFor(accId,key);
    let cls="wait", mark="", hrs="";
    if(!isWd){ cls="off"; mark=""; }
    else if(start && key<start){ cls="off"; mark=""; }            // 도입 이전 → 비대상
    else if(rec && key<=today){ cls="done"; mark="✔ 실시"; hrs=(rec.durationMin||0)+"′"; }
    else if(rec){ cls="wait"; mark="✔ 등록"; hrs=(rec.durationMin||0)+"′"; }   // 미래 등록 → 예정(등록)
    else if(key>today){ cls="wait"; mark="예정"; }
    else { cls="miss"; mark="✕ 미실시"; }
    const extra=(key===today?" today":"")+(dow===0?" sun":dow===6?" sat":"");
    cells+=`<div class="cal-cell ${cls}${extra}" ${rec?`data-act="viewRec" data-id="${rec.id}"`:""}>
      <div class="dn">${d}</div>${hrs?`<div class="hrs">${hrs}</div>`:""}
      <div class="cal-mark">${mark}</div></div>`;
  }
  return `
    <div class="cal-head">
      <div class="cal-nav">
        <button class="btn sm" data-act="calPrev">‹</button>
        <span class="lbl">${y}. ${pad2(m)}</span>
        <button class="btn sm" data-act="calNext">›</button>
        <button class="btn sm ghost" data-act="calToday">오늘</button>
      </div>
      <div class="legend">
        <span><i class="i-done"></i>실시</span><span><i class="i-miss"></i>미실시</span>
        <span><i class="i-wait"></i>예정</span><span><i class="i-off"></i>비근무</span>
      </div>
    </div>
    <div class="calendar">${dowHead}${cells}</div>`;
}

/* =========================================================================
   관리자 페이지 — 대시보드
   ========================================================================= */
function halfOptions(){
  const cur=halfOf(new Date()); const y=cur.y;
  const keys=[];
  for(let yy=y+0; yy>=y-1; yy--){ keys.push(yy+"-H2"); keys.push(yy+"-H1"); }
  return keys.map(k=>{const h=halfByKey(k);return `<option value="${k}" ${state.halfKey===k?'selected':''}>${h.y} ${h.label}</option>`;}).join("");
}

function viewDashboard(){
  const half=halfByKey(state.halfKey);
  const teams=DB.teams();
  const accs=DB.userAccounts().filter(a=>a.active);
  const comps=accs.map(a=>({a, t:DB.team(a.teamId), c:computeAcc(a.id, half)}));
  const totalTarget=comps.reduce((a,x)=>a+x.c.target,0);
  const totalAcc=comps.reduce((a,x)=>a+x.c.accHours,0);
  const totalMissed=comps.reduce((a,x)=>a+x.c.missed,0);
  const avgPct=comps.length? Math.round(comps.reduce((a,x)=>a+Math.min(100,x.c.pct),0)/comps.length):0;
  const doneCnt=comps.filter(x=>x.c.pct>=100).length;

  const alerts=comps.filter(x=>x.c.missed>0)
    .sort((a,b)=>b.c.missed-a.c.missed)
    .map(x=>{
      const recent=x.c.missedDates.slice(-3).reverse().map(fmtK).join(", ");
      return `<div class="rec-item"><span class="chip miss">미실시 ${x.c.missed}일</span>
        <div class="info"><div class="t">${esc(x.a.name)} <span class="subtle">· ${esc(x.t?x.t.name:'부서 미지정')}</span></div>
        <div class="s">최근 미실시: ${recent||"-"}</div></div>
        <button class="btn sm" data-act="gotoDaily" data-acc="${x.a.id}">일별 점검</button></div>`;
    }).join("");

  // 부서별 그룹
  const byTeam=new Map();
  teams.forEach(t=>byTeam.set(t.id,[]));
  comps.forEach(x=>{ if(!byTeam.has(x.a.teamId)) byTeam.set(x.a.teamId,[]); byTeam.get(x.a.teamId).push(x); });

  function card(x){
    const {a,c}=x;
    const barCls=c.pct>=100?"over":c.pct>=60?"":c.pct>=30?"low":"crit";
    return `<div class="tcard">
      <div class="top">
        <div style="flex:1;min-width:0"><div class="nm">${esc(a.name)}</div>
          <div class="sup">${esc(a.username)} · ${c.pct>=100?'목표 달성':c.missed>0?'미실시 '+c.missed+'일':'진행 중'}</div></div>
        ${ring(c.pct)}
      </div>
      <div class="bd2">
        <div class="progress"><div class="fill ${barCls}" style="width:${Math.min(100,c.pct)}%"></div></div>
        <div class="prog-meta"><span>${round1(c.accHours)}h / ${c.target}h</span><span class="pct">잔여 ${round1(c.remaining)}h</span></div>
        <div class="mini-row">
          <div class="mini"><div class="mv">${c.done}</div><div class="mk">실시(회)</div></div>
          <div class="mini miss"><div class="mv">${c.missed}</div><div class="mk">미실시(일)</div></div>
          <div class="mini rem"><div class="mv">${round1(c.remaining)}</div><div class="mk">잔여(h)</div></div>
        </div>
      </div></div>`;
  }

  const teamBlocks=teams.map(t=>{
    const list=byTeam.get(t.id)||[];
    const inner = list.length ? `<div class="team-grid">${list.map(card).join("")}</div>`
      : `<div class="empty" style="padding:20px 0">이 부서에 배정된 관리감독자 계정이 없습니다. <b>계정 관리</b>에서 추가하세요.</div>`;
    return `<div class="dept-block"><div class="dept-h"><span class="dept-nm">${esc(t.name)}</span><span class="dept-c">관리감독자 ${list.length}명</span></div>${inner}</div>`;
  }).join("");

  return `
  <div class="panel no-print">
    <div class="hd"><span class="eyebrow">DASHBOARD</span><h2>반기 목표 달성 현황</h2>
      <div class="field no-print" style="margin-left:auto;flex-direction:row;align-items:center;gap:8px">
        <label style="white-space:nowrap">기준 반기</label>
        <select data-f="halfKey" style="width:auto">${halfOptions()}</select>
        <button class="btn sm" data-act="exportXlsx" title="진행상태를 엑셀 파일로 추출">⬇ 엑셀 추출</button>
      </div></div>
    <div class="bd">
      <div class="stat-row">
        <div class="stat"><div class="k">기준 기간</div><div class="v" style="font-size:18px">${half.y} ${half.label}</div>
          <div class="sub">${(half.start.getMonth()+1)}.1 ~ ${(half.end.getMonth()+1)}.${half.end.getDate()}</div></div>
        <div class="stat ${avgPct>=100?'good':avgPct>=50?'':'amber'}"><div class="k">평균 달성률</div><div class="v">${avgPct}<small>%</small></div>
          <div class="sub">${doneCnt}/${comps.length}명 목표 달성</div></div>
        <div class="stat good"><div class="k">총 누적시간</div><div class="v">${round1(totalAcc)}<small>h</small></div>
          <div class="sub">목표 합계 ${round1(totalTarget)}h</div></div>
        <div class="stat ${totalMissed>0?'bad':'good'}"><div class="k">총 미실시</div><div class="v">${totalMissed}<small>일</small></div>
          <div class="sub">전 관리감독자 누계</div></div>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="hd"><span class="eyebrow">BY SUPERVISOR</span><h2>부서 · 관리감독자별 상세</h2></div>
    <div class="bd">
      ${comps.length? teamBlocks : `<div class="empty"><div class="big">등록된 관리감독자 계정이 없습니다</div><b>계정 관리</b> 탭에서 관리감독자 계정을 추가하세요.</div>`}
    </div>
  </div>

  <div class="panel">
    <div class="hd"><span class="eyebrow">ALERTS</span><h2>미실시 경보</h2></div>
    <div class="bd">${alerts? `<div class="list">${alerts}</div>` : `<div class="empty"><div class="big">미실시 항목이 없습니다</div>모든 관리감독자가 근무일 TBM을 정상 실시하고 있습니다.</div>`}</div>
  </div>`;
}

/* =========================================================================
   관리자 페이지 — 일별 점검
   ========================================================================= */
function acctOptions(sel){
  const teams=DB.teams(), accs=DB.userAccounts().filter(a=>a.active);
  return teams.map(t=>{
    const list=accs.filter(a=>a.teamId===t.id);
    if(!list.length) return "";
    return `<optgroup label="${esc(t.name)}">${list.map(a=>`<option value="${a.id}" ${sel===a.id?'selected':''}>${esc(a.name)} (${esc(a.username)})</option>`).join("")}</optgroup>`;
  }).join("");
}
function viewDaily(){
  const s=DB.settings(), today=todayYmd();
  const accs=DB.userAccounts().filter(a=>a.active);
  const y=state.calY, m=state.calM;
  const sel=state.calTeam; // 'all' 또는 accountId
  const dowHead=DOW.map((d,i)=>`<div class="cal-dow ${i===0?'sun':i===6?'sat':''}">${d}</div>`).join("");
  const first=new Date(y,m-1,1), startPad=first.getDay(), days=new Date(y,m,0).getDate();
  let cells="";
  for(let i=0;i<startPad;i++) cells+=`<div class="cal-cell pad"></div>`;
  for(let d=1;d<=days;d++){
    const dt=new Date(y,m-1,d), key=ymd(dt), dow=dt.getDay();
    const isWd=s.workdays.includes(dow);
    const extra=(key===today?" today":"")+(dow===0?" sun":dow===6?" sat":"");
    let cls="wait", mark="", hrs="", clickable="";
    if(sel==="all"){
      const adopt=adoptionDate();
      if(!isWd){ cls="off"; }
      else if(adopt && key<adopt){ cls="off"; }              // 최초 도입 이전 → 비대상
      else if(key>today){ cls="wait"; mark="예정"; }          // 미래 → 예정
      else {
        const done=DB.recordsDoneOn(key);
        const doneCnt=accs.filter(a=>done.has(a.id)).length;
        const tot=accs.length;
        if(tot>0 && doneCnt===tot){ cls="done"; mark=`전체 ${doneCnt}/${tot}`; }
        else { cls="miss"; mark=`${doneCnt}/${tot}`; }
        if(doneCnt>0) clickable=`data-act="viewDay" data-date="${key}"`;
      }
    } else {
      const rec=DB.recordFor(sel,key);
      const start=acctStartYmd(DB.account(sel));
      if(!isWd){ cls="off"; }
      else if(start && key<start){ cls="off"; }               // 도입 이전 → 비대상
      else if(rec && key<=today){ cls="done"; mark="✔ 실시"; hrs=(rec.durationMin||0)+"′"; clickable=`data-act="viewRec" data-id="${rec.id}"`; }
      else if(rec){ cls="wait"; mark="✔ 등록"; hrs=(rec.durationMin||0)+"′"; clickable=`data-act="viewRec" data-id="${rec.id}"`; }
      else if(key>today){ cls="wait"; mark="예정"; }
      else { cls="miss"; mark="✕ 미실시"; }
    }
    cells+=`<div class="cal-cell ${cls}${extra}" ${clickable}>
      <div class="dn">${d}</div>${hrs?`<div class="hrs">${hrs}</div>`:""}
      <div class="cal-mark">${mark}</div></div>`;
  }
  return `
  <div class="panel">
    <div class="hd"><span class="eyebrow">DAILY CHECK</span><h2>일별 TBM 진행여부 자동 점검</h2>
      <div class="field no-print" style="margin-left:auto;flex-direction:row;align-items:center;gap:8px">
        <label style="white-space:nowrap">대상</label>
        <select data-f="calTeam" style="width:auto">
          <option value="all" ${sel==='all'?'selected':''}>전체 관리감독자</option>
          ${acctOptions(sel)}
        </select>
      </div></div>
    <div class="bd">
      <div class="cal-head">
        <div class="cal-nav">
          <button class="btn sm" data-act="calPrev">‹</button>
          <span class="lbl">${y}. ${pad2(m)}</span>
          <button class="btn sm" data-act="calNext">›</button>
          <button class="btn sm ghost" data-act="calToday">오늘</button>
        </div>
        <div class="legend">
          <span><i class="i-done"></i>${sel==='all'?'전체 실시':'실시'}</span><span><i class="i-miss"></i>미실시</span>
          <span><i class="i-wait"></i>예정</span><span><i class="i-off"></i>비근무</span>
        </div>
      </div>
      <div class="calendar">${dowHead}${cells}</div>
      <p class="subtle" style="margin-top:14px">${sel==='all'?"칸의 숫자는 <b>실시 관리감독자 수 / 전체</b>입니다. 실시 인원이 있는 날을 클릭하면 관리감독자별 실시현황을 볼 수 있습니다.":"✔ 실시된 날짜(칸)를 클릭하면 등록된 TBM 상세 내용을 볼 수 있습니다."} 미실시는 근무일 기준 자동 판정됩니다.</p>
    </div>
  </div>`;
}

/* =========================================================================
   관리자 페이지 — 기록 열람
   ========================================================================= */
function viewRecords(){
  const teams=DB.teams();
  const q=(state.recSearch||"").trim().toLowerCase();
  let recs=DB.records().slice();
  if(state.recDept && state.recDept!=="all") recs=recs.filter(r=>r.teamId===state.recDept);
  if(state.recTeam && state.recTeam!=="all") recs=recs.filter(r=>r.accountId===state.recTeam);
  if(state.recSeason==="season") recs=recs.filter(r=>r.season);
  else if(state.recSeason==="photo") recs=recs.filter(r=>r.photos&&r.photos.length);
  if(state.recFrom) recs=recs.filter(r=>r.date>=state.recFrom);
  if(state.recTo) recs=recs.filter(r=>r.date<=state.recTo);
  if(q) recs=recs.filter(r=>[(r.items||[]).map(i=>i.h+" "+i.m).join(" "), r.attendees||"", r.note||"", r.supervisor||""].join(" ").toLowerCase().includes(q));
  recs.sort((a,b)=> state.recSort==="asc" ? (a.date<b.date?-1:a.date>b.date?1:0) : (a.date<b.date?1:a.date>b.date?-1:0));

  const totalMin=recs.reduce((s,r)=>s+(+r.durationMin||0),0);
  const withPhoto=recs.filter(r=>r.photos&&r.photos.length).length;
  const deptOpts=teams.map(t=>`<option value="${t.id}" ${state.recDept===t.id?'selected':''}>${esc(t.name)}</option>`).join("");
  const active=!!(q||state.recFrom||state.recTo||(state.recDept&&state.recDept!=="all")||(state.recTeam&&state.recTeam!=="all")||(state.recSeason&&state.recSeason!=="all"));

  return `
  <div class="panel">
    <div class="hd"><span class="eyebrow">RECORDS</span><h2>TBM 기록 열람</h2>
      <span class="count" style="margin-left:auto">${recs.length}건 · 누적 ${round1(totalMin/60)}h · 사진 ${withPhoto}건</span></div>
    <div class="bd">
      <div class="rec-filters no-print">
        <div class="field grow"><label>검색</label>
          <input type="text" data-f="recSearch" value="${esc(state.recSearch||"")}" placeholder="위험요인·대책·참석자·비고 검색"></div>
        <div class="field"><label>부서</label><select data-f="recDept">
          <option value="all" ${!state.recDept||state.recDept==='all'?'selected':''}>전체 부서</option>${deptOpts}</select></div>
        <div class="field"><label>관리감독자</label><select data-f="recTeam">
          <option value="all" ${!state.recTeam||state.recTeam==='all'?'selected':''}>전체</option>${acctOptions(state.recTeam)}</select></div>
        <div class="field"><label>구분</label><select data-f="recSeason">
          <option value="all" ${!state.recSeason||state.recSeason==='all'?'selected':''}>전체</option>
          <option value="season" ${state.recSeason==='season'?'selected':''}>계절 특별관리</option>
          <option value="photo" ${state.recSeason==='photo'?'selected':''}>사진 있는 기록</option></select></div>
        <div class="field"><label>시작일</label><input type="date" data-f="recFrom" value="${state.recFrom||""}"></div>
        <div class="field"><label>종료일</label><input type="date" data-f="recTo" value="${state.recTo||""}"></div>
        <div class="field"><label>정렬</label><select data-f="recSort">
          <option value="desc" ${state.recSort!=='asc'?'selected':''}>최신순</option>
          <option value="asc" ${state.recSort==='asc'?'selected':''}>오래된순</option></select></div>
        <button class="btn ${active?'':'ghost'}" data-act="recReset">필터 초기화</button>
      </div>
      ${recs.length? `<div class="list">${recs.map(r=>{
        const tm=DB.team(r.teamId), ac=DB.account(r.accountId), np=(r.photos&&r.photos.length)||0;
        return `<div class="rec-item" data-act="viewRec" data-id="${r.id}" style="cursor:pointer">
          <span class="d">${r.date.slice(2).replace(/-/g,".")}</span>
          <div class="info"><div class="t">${esc(ac?ac.name:(r.supervisor||"-"))} <span class="subtle">· ${esc(tm?tm.name:(r.teamId||"-"))}</span> · ${r.durationMin||0}분 ${r.season?`<span class="chip ${r.season}" style="margin-left:4px">${seasonLabel(r.season)}</span>`:""}${np?`<span class="rec-badge">📷 ${np}</span>`:""}</div>
            <div class="s">${esc((r.items||[]).map(i=>i.h).filter(Boolean).join(" / "))||"—"}</div>
            ${r.attendees?`<div class="s subtle">참석: ${esc(r.attendees)}</div>`:""}</div>
          <button class="btn sm danger" data-act="delRec" data-id="${r.id}">삭제</button></div>`;
      }).join("")}</div>` : `<div class="empty"><div class="ic">🗂️</div><div class="big">${active?"조건에 맞는 기록이 없습니다":"등록된 기록이 없습니다"}</div>${active?"필터를 조정하거나 초기화해 보세요.":"관리감독자가 TBM을 등록하면 여기에 표시됩니다."}</div>`}
    </div>
  </div>`;
}

/* =========================================================================
   관리자 페이지 — 설정
   ========================================================================= */
function viewSettings(){
  const s=DB.settings(), teams=DB.teams();
  const dowLabels=[["1","월"],["2","화"],["3","수"],["4","목"],["5","금"],["6","토"],["0","일"]];
  return `
  <div class="panel">
    <div class="hd"><span class="eyebrow">SETTINGS</span><h2>목표·운영 설정</h2></div>
    <div class="bd">
      <div class="set-grid">
        <div class="field"><label>사업장명</label>
          <input type="text" data-set="orgName" value="${esc(s.orgName)}" placeholder="예) ○○제조 오산공장"></div>
        <div class="field"><label>반기 목표 교육시간 (시간)</label>
          <input type="number" min="1" max="200" step="0.5" data-set="halfTargetHours" value="${s.halfTargetHours}">
          <span class="hint">상·하반기 각각 채워야 할 누적 TBM 교육시간</span></div>
        <div class="field"><label>1회 TBM 인정시간 (분)</label>
          <input type="number" min="1" max="120" data-set="sessionMinutes" value="${s.sessionMinutes}">
          <span class="hint">등록 시 기본값으로 사용</span></div>
      </div>
      <div class="divider"></div>
      <div class="field"><label>근무요일 (TBM 실시 대상일)</label>
        <div class="dow-pick">
          ${dowLabels.map(([v,l])=>`<label class="${s.workdays.includes(+v)?'on':''}"><input type="checkbox" data-dow="${v}" ${s.workdays.includes(+v)?'checked':''}>${l}</label>`).join("")}
        </div>
        <span class="hint" style="margin-top:6px">선택한 요일만 진행여부·미실시 통계에 반영됩니다.</span>
      </div>
      <div class="divider"></div>
      <div class="field" style="max-width:420px">
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
          <span class="switch"><input type="checkbox" data-set-bool="seasonDefaultOn" ${s.seasonDefaultOn?'checked':''}><span></span></span>
          계절 특별관리 자동 포함 (기본값)</label>
        <span class="hint">혹서기·혹한기에 관련 안전 항목을 자동 편성합니다.</span>
      </div>
      <div class="btn-row" style="margin-top:18px"><button class="btn primary lg" data-act="saveSettings">설정 저장</button></div>
    </div>
  </div>

  <div class="panel">
    <div class="hd"><span class="eyebrow">TEAMS</span><h2>부서 관리</h2></div>
    <div class="bd">
      <p class="subtle" style="margin-top:0">부서명을 <b>직접 입력</b>해 추가하고, 교육콘텐츠 카테고리를 지정하세요. 관리감독자(로그인 계정)는 <b>계정 관리</b> 탭에서 부서에 배정하며, 한 부서에 여러 명을 배정할 수 있습니다.</p>
      <div class="dept-add">
        <div class="field"><label>부서명</label>
          <input type="text" id="ntName" placeholder="예) 소재제조 2팀" autocomplete="off"></div>
        <div class="field"><label>교육콘텐츠 카테고리</label>
          <select id="ntCat">
            ${TBM_DB.categories.filter(c=>c.type==="dept").map(c=>`<option value="${c.id}">${esc(c.name)} 콘텐츠</option>`).join("")}
            <option value="all">전체(부서+공통)</option>
          </select></div>
        <button class="btn primary" data-act="addTeamNamed">＋ 부서 추가</button>
      </div>
      <div class="team-list">
        ${teams.map((t,i)=>`<div class="team-row">
          <span class="tnum">${i+1}</span>
          <input type="text" data-team-i="${i}" data-team-k="name" value="${esc(t.name)}" placeholder="부서명">
          <select data-team-i="${i}" data-team-k="contentCat">
            ${TBM_DB.categories.filter(c=>c.type==="dept").map(c=>`<option value="${c.id}" ${t.contentCat===c.id?'selected':''}>${esc(c.name)} 콘텐츠</option>`).join("")}
            <option value="all" ${t.contentCat==="all"?'selected':''}>전체(부서+공통)</option>
          </select>
          <button class="btn sm danger" data-act="delTeam" data-i="${i}">삭제</button>
        </div>`).join("")}
      </div>
      <div class="btn-row" style="margin-top:12px">
        <button class="btn primary" data-act="saveTeams">부서 정보 저장</button>
        <span class="subtle">기존 부서명·콘텐츠를 수정한 뒤 저장하세요.</span>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="hd"><span class="eyebrow">DATA</span><h2>데이터 관리 (기기 간 이전 · 백업)</h2></div>
    <div class="bd">
      <p class="subtle" style="margin-top:0">이 시스템은 브라우저에 데이터를 저장합니다. 다른 기기·브라우저로 옮기려면 <b>내보내기</b>한 파일을 상대 기기에서 <b>가져오기</b> 하세요. (여러 기기 실시간 공유가 필요하면 사용안내의 서버 연동 가이드를 참고하세요.)</p>
      <div class="btn-row">
        <button class="btn" data-act="exportData">⬇ 전체 데이터 내보내기(JSON)</button>
        <button class="btn" data-act="importData">⬆ 데이터 가져오기</button>
        <button class="btn danger" data-act="resetData">전체 초기화</button>
      </div>
      <input type="file" id="importFile" accept="application/json,.json" style="display:none">
    </div>
  </div>`;
}

/* =========================================================================
   관리자 페이지 — 계정 관리 (관리감독자 로그인 계정)
   ========================================================================= */
function viewAccounts(){
  const s=DB.settings();
  const teams=DB.teams();
  const accs=DB.accounts();
  const users=accs.filter(a=>a.role==="user");
  const teamOpts=(sel)=>teams.map(t=>`<option value="${t.id}" ${sel===t.id?'selected':''}>${esc(t.name)}</option>`).join("");
  return `
  <div class="panel no-print">
    <div class="hd"><span class="eyebrow">ACCOUNTS</span><h2>관리감독자 계정 추가</h2></div>
    <div class="bd">
      <p class="subtle" style="margin-top:0">관리감독자별 로그인 계정을 만듭니다. 한 부서에 여러 명을 추가할 수 있습니다. 아이디는 로그인에 사용되며 중복될 수 없습니다.</p>
      <div class="acc-add">
        <div class="field"><label>이름</label><input type="text" id="naName" placeholder="예) 홍길동"></div>
        <div class="field"><label>아이디</label><input type="text" id="naUser" placeholder="예) hong"></div>
        <div class="field"><label>비밀번호</label><input type="text" id="naPw" placeholder="초기 비밀번호"></div>
        <div class="field"><label>소속 부서</label><select id="naTeam">${teamOpts(teams[0]?.id)}</select></div>
        <div class="field"><label>반기 목표(h)<span class="subtle"> · 선택</span></label><input type="number" id="naTarget" min="0" step="0.5" placeholder="기본 ${s.halfTargetHours}"></div>
        <div><button class="btn primary" data-act="accAdd" style="height:40px">＋ 계정 추가</button></div>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="hd"><span class="eyebrow">SUPERVISORS</span><h2>관리감독자 계정 (${users.length})</h2></div>
    <div class="bd">
      ${users.length? `<div class="acc-table">
        <div class="acc-h"><div>이름</div><div>아이디</div><div>부서</div><div>목표(h)</div><div>사용</div><div>비밀번호 재설정</div><div></div></div>
        ${users.map(a=>`<div class="acc-row" data-acc-row="${a.id}">
          <div><input type="text" data-ax="name" value="${esc(a.name)}"></div>
          <div><input type="text" data-ax="username" value="${esc(a.username)}"></div>
          <div><select data-ax="teamId">${teamOpts(a.teamId)}</select></div>
          <div><input type="number" data-ax="targetHours" min="0" step="0.5" value="${a.targetHours!=null?a.targetHours:''}" placeholder="${s.halfTargetHours}"></div>
          <div style="text-align:center"><input type="checkbox" data-ax="active" ${a.active?'checked':''}></div>
          <div><input type="text" data-ax="newpw" placeholder="새 비밀번호(선택)"></div>
          <div><button class="btn sm danger" data-act="accDel" data-id="${a.id}">삭제</button></div>
        </div>`).join("")}
      </div>
      <div class="btn-row" style="margin-top:14px"><button class="btn primary" data-act="accSaveAll">변경 내용 저장</button></div>
      <p class="subtle" style="margin-top:10px">‘새 비밀번호’ 칸에 입력한 계정만 비밀번호가 변경됩니다. 아이디는 중복될 수 없습니다.</p>`
      : `<div class="empty"><div class="big">등록된 관리감독자 계정이 없습니다</div>위에서 계정을 추가하세요.</div>`}
    </div>
  </div>

  <div class="panel">
    <div class="hd"><span class="eyebrow">ADMIN</span><h2>관리자 계정 (안전보건담당자)</h2></div>
    <div class="bd">
      ${accs.filter(a=>a.role==="admin").map(a=>`<div class="acc-row admin" data-acc-row="${a.id}">
        <div><input type="text" data-ax="name" value="${esc(a.name)}"></div>
        <div><input type="text" data-ax="username" value="${esc(a.username)}"></div>
        <div><input type="text" data-ax="newpw" placeholder="새 비밀번호(선택)"></div>
        <div><button class="btn sm" data-act="accSaveOne" data-id="${a.id}">저장</button></div>
      </div>`).join("")}
      <p class="subtle" style="margin-top:10px">관리자 계정도 아이디·비밀번호를 변경할 수 있습니다. 보안을 위해 최초 <b>admin</b> 비밀번호는 반드시 변경하세요.</p>
    </div>
  </div>`;
}

/* =========================================================================
   공통 — 교육콘텐츠 관리
   ========================================================================= */
function viewContent(){
  const cats=TBM_DB.categories;
  const items=itemsFor(state.cmCat).map((x,i)=>({...x,i}));
  const q=state.cmSearch.trim();
  const filtered=q? items.filter(x=>(x.h+x.m).includes(q)) : items;
  const custom=customFor(state.cmCat).length;
  return `
  <div class="panel">
    <div class="hd"><span class="eyebrow">DATABASE</span><h2>교육콘텐츠 관리</h2>
      <span class="count" style="margin-left:auto">전체 ${items.length}건 · 직접입력 ${custom}건</span></div>
    <div class="bd">
      <div class="ctrl-grid" style="margin-bottom:16px">
        <div class="field"><label>구분 선택</label>
          <select data-f="cmCat">${cats.map(c=>`<option value="${c.id}" ${state.cmCat===c.id?'selected':''}>${esc(c.name)}</option>`).join("")}</select></div>
        <div class="field" style="grid-column:span 2"><label>검색</label>
          <input type="text" data-f="cmSearch" value="${esc(state.cmSearch)}" placeholder="위험요인·대책 키워드 검색"></div>
      </div>
      <div class="panel" style="box-shadow:none;margin:0 0 16px">
        <div class="hd"><h2 style="font-size:14px">＋ 직접 입력 (무제한 추가 · 자동생성에 즉시 반영)</h2></div>
        <div class="bd add-box">
          <div class="field"><label>위험요인</label><textarea data-add="h" placeholder="예) 지게차 후진 중 보행자 충돌"></textarea></div>
          <div class="field"><label>위험방지대책</label><textarea data-add="m" placeholder="예) 후방경보기·유도자 배치, 제한속도 준수"></textarea></div>
          <div><button class="btn primary" data-act="addItem">＋ 콘텐츠 추가</button></div>
        </div>
      </div>
      <div class="clist">
        ${filtered.length? filtered.map(x=>`
          <div class="item">
            <div class="n">${x.i+1}</div>
            <div class="body"><div class="haz">${esc(x.h)}</div><div class="mea">↳ ${esc(x.m)}</div></div>
            <span class="badge ${x.seed?'':'custom'}">${x.seed?'기본':'직접입력'}</span>
            ${x.seed?'':`<button class="btn sm danger" data-act="delItem" data-h="${esc(x.h)}">삭제</button>`}
          </div>`).join("") : `<div class="empty">검색 결과가 없습니다.</div>`}
      </div>
    </div>
  </div>`;
}

/* =========================================================================
   공통 — 사용안내
   ========================================================================= */
function viewHelp(){
  return `
  <div class="panel"><div class="bd help" style="max-width:860px">
    <h2 style="margin-top:0">TBM 통합관리 시스템 사용안내</h2>
    <p>제조업 현장의 <b>TBM(작업 전 안전점검회의)</b>을 관리감독자가 등록하고, 안전보건담당자가 진행여부·목표시간을 관리하도록 설계된 시스템입니다. 사용자·관리자 화면은 하나의 데이터베이스를 공유합니다.</p>

    <h3>👷 관리감독자 (사용자 페이지)</h3>
    <ul>
      <li><b>TBM 등록</b>: 날짜를 고르고 <span class="kbd">교육내용 자동생성</span>을 누르면 위험요인 3건과 대책 3건이 자동 편성됩니다. 모든 칸은 현장 상황에 맞게 수정할 수 있고, 항목별 <span class="kbd">⟳ 재생성</span>도 가능합니다. 교육시간·참석자·비고를 입력해 <span class="kbd">등록</span>합니다.</li>
      <li>등록은 <b>오늘까지의 날짜</b>만 가능합니다(미래 날짜는 미리 등록할 수 없음). 지난 날짜는 언제든 추가 등록·수정할 수 있습니다.</li>
      <li><b>내 현황</b>: 우리 부서의 반기 목표 대비 누적시간·잔여시간과 일별 실시 캘린더를 확인합니다.</li>
      <li>계절(혹서기 6~8월 / 혹한기 12~1월)에는 관련 안전 항목이 매일 1건 자동 포함됩니다.</li>
    </ul>

    <h3>🛡️ 안전보건담당자 (관리자 페이지)</h3>
    <ul>
      <li><b>대시보드</b>: 반기 기준 부서별 목표시간·누적시간·<b>잔여시간</b>·달성률과 미실시 경보를 한눈에 봅니다.</li>
      <li><b>일별 점검</b>: 관리감독자가 등록하면 매일 진행여부가 자동 체크됩니다. 근무일 기준으로 실시·미실시·예정이 자동 판정되며, 실시된 날을 클릭하면 상세 내용을 볼 수 있습니다.</li>
      <li><b>설정</b>: 반기 목표시간, 1회 인정시간, 근무요일, 계절 자동포함, 부서·관리감독자 명단을 자유롭게 커스터마이징합니다.</li>
      <li><b>데이터 관리</b>: 내보내기/가져오기로 백업하거나 다른 기기로 이전합니다.</li>
    </ul>

    <h3>여러 기기에서 실시간으로 공유하려면</h3>
    <div class="note">${REMOTE.enabled
      ? "현재 <b>여러 디바이스 공유("+REMOTE.mode+")</b> 모드입니다. 7개 디바이스에서 등록한 교육일지·사진이 서버에 저장·공유되며"+(REMOTE.mode==='netlify'?"(약 7초 간격 자동 갱신)":"(변경 즉시 실시간 반영)")+", 아래 내보내기는 별도 백업 용도로 사용하세요."
      : "현재 <b>로컬 저장(localStorage)</b> 모드입니다. 이 기기에서 입력한 데이터만 저장되며 다른 기기와 공유되지 않습니다. 여러 기기 공유가 필요하면 배포가이드의 <b>‘Netlify 공유 배포’</b> 절차대로 배포하면 됩니다."}</div>

    <p style="color:var(--muted);font-size:12px;margin-top:20px">※ 본 콘텐츠는 산업안전보건 일반 기준을 참고한 예시이며, 실제 적용 시 사업장 위험성평가 결과와 관련 법규에 맞게 검토·보완하여 사용하시기 바랍니다.</p>
  </div></div>`;
}

/* =========================================================================
   모달 & 상세 / 인쇄
   ========================================================================= */
function openModal(title, html){ $("#modalTitle").textContent=title; $("#modalBody").innerHTML=html; $("#modal").classList.add("on"); }
function closeModal(){ $("#modal").classList.remove("on"); }

function recDetailHTML(r){
  const tm=DB.team(r.teamId);
  const rows=(r.items||[]).map((it,i)=>`
    <tr><td style="text-align:center;background:#f4f7f4;font-weight:800;width:34px">${i+1}</td>
    <td><b>${esc(it.h)}</b><div style="color:var(--ink-soft);margin-top:4px;font-size:12.5px">↳ ${esc(it.m)}</div></td></tr>`).join("");
  return `
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">
      <span class="chip done">${fmtK(r.date)}</span>
      <span class="chip wait">${esc(tm?tm.name:r.teamId)}</span>
      <span class="chip wait">교육 ${r.durationMin||0}분</span>
      ${r.season?`<span class="chip ${r.season}">${seasonLabel(r.season)}</span>`:""}
    </div>
    <div class="subtle" style="margin-bottom:10px">
      관리감독자: ${esc(r.supervisor||"-")}${r.attendees?" · 참석: "+esc(r.attendees):""}${r.note?" · 비고: "+esc(r.note):""}
    </div>
    <table style="border-collapse:collapse;width:100%">
      <thead><tr><th style="border:1px solid var(--line-strong);background:var(--safe-head);padding:7px;width:34px">No</th>
      <th style="border:1px solid var(--line-strong);background:var(--safe-head);padding:7px;text-align:left">위험요인 · 위험방지대책</th></tr></thead>
      <tbody>${(r.items||[]).map((it,i)=>`<tr>
        <td style="border:1px solid var(--line-strong);text-align:center;background:#f4f7f4;font-weight:800">${i+1}</td>
        <td style="border:1px solid var(--line-strong);padding:8px"><b>${esc(it.h)}</b>
          <div style="color:var(--ink-soft);margin-top:4px;font-size:12.5px">↳ ${esc(it.m)}</div></td></tr>`).join("")}</tbody>
    </table>
    ${(r.photos&&r.photos.length)?`<div style="margin-top:16px">
      <div class="m-lab" style="margin-bottom:8px">📷 현장 사진 <span class="count">${r.photos.length}장</span></div>
      <div class="photo-grid view">${r.photos.map((src,i)=>`<div class="photo-thumb"><img src="${src}" data-act="viewPhoto" data-rid="${r.id}" data-i="${i}" alt="현장 사진 ${i+1}" style="cursor:zoom-in"></div>`).join("")}</div>
      <span class="hint">사진을 누르면 크게 볼 수 있습니다.</span></div>`:""}
    <div class="btn-row" style="margin-top:16px">
      <button class="btn" data-act="printRec" data-id="${r.id}">🖨 인쇄 / PDF</button>
      <button class="btn danger" data-act="delRecModal" data-id="${r.id}">삭제</button>
    </div>`;
}

function dayDetailHTML(date){
  const accs=DB.userAccounts().filter(a=>a.active);
  const rows=accs.map(a=>{
    const tm=DB.team(a.teamId);
    const r=DB.recordFor(a.id,date);
    if(r) return `<div class="rec-item" data-act="viewRec" data-id="${r.id}" style="cursor:pointer">
      <span class="chip done">실시</span><div class="info"><div class="t">${esc(a.name)} <span class="subtle">· ${esc(tm?tm.name:'-')}</span></div>
      <div class="s">${esc((r.items||[]).map(i=>i.h).filter(Boolean).join(" / "))}</div></div>
      <span class="d">${r.durationMin||0}′</span></div>`;
    return `<div class="rec-item"><span class="chip miss">미실시</span>
      <div class="info"><div class="t">${esc(a.name)} <span class="subtle">· ${esc(tm?tm.name:'-')}</span></div><div class="s">등록된 TBM 없음</div></div></div>`;
  }).join("");
  return `<div class="list">${rows||'<div class="empty">활성화된 관리감독자 계정이 없습니다.</div>'}</div>`;
}

function printRecObj(r){
  const tm=DB.team(r.teamId), s=DB.settings();
  const w=window.open("","_blank","width=820,height=920");
  if(!w){ toast("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요."); return; }
  const rows=(r.items||[]).map((it,i)=>`<tr><td style="text-align:center;width:36px">${i+1}</td><td><b>${esc(it.h)}</b><br><span style="color:#3c4f47">↳ ${esc(it.m)}</span></td></tr>`).join("");
  w.document.write(`<!DOCTYPE html><html lang=ko><head><meta charset=utf-8><title>TBM ${r.date}</title>
  <style>body{font-family:'Malgun Gothic',sans-serif;padding:26px;color:#12251d}
  h1{font-size:19px;margin:0 0 4px} .meta{font-size:13px;color:#3c4f47;margin:8px 0 14px;line-height:1.7}
  table{border-collapse:collapse;width:100%} th,td{border:1px solid #888;padding:8px;font-size:13px;vertical-align:top}
  th{background:#d7e8d6} .sign{margin-top:44px;font-size:13px}
  .pg{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px} .pg img{max-width:31%;border:1px solid #999;border-radius:6px}
  .ph-h{font-weight:700;margin:18px 0 4px;font-size:14px}</style></head>
  <body><h1>TBM(Tool Box Meeting) 교육일지</h1>
  <div class="meta">사업장: ${esc(s.orgName||"　")} &nbsp;|&nbsp; 부서: ${esc(tm?tm.name:"")} &nbsp;|&nbsp; 관리감독자: ${esc(r.supervisor||"　")}<br>
  일자: ${fmtK(r.date)} &nbsp;|&nbsp; 교육시간: ${r.durationMin||0}분 &nbsp;|&nbsp; 참석자: ${esc(r.attendees||"　")}${r.note?"<br>특이사항: "+esc(r.note):""}</div>
  <table><thead><tr><th style="width:36px">No</th><th style="text-align:left">위험요인 및 위험방지대책</th></tr></thead><tbody>${rows}</tbody></table>
  ${(r.photos&&r.photos.length)?`<div class="ph-h">현장 사진</div><div class="pg">${r.photos.map(src=>`<img src="${src}">`).join("")}</div>`:""}
  <div class="sign">확인(서명) &nbsp;&nbsp; 관리감독자 : ______________ &nbsp;&nbsp;&nbsp; 안전보건담당자 : ______________</div>
  </body></html>`);
  w.document.close(); w.focus(); setTimeout(()=>{try{w.print();}catch(e){}},350);
}

/* =========================================================================
   액션
   ========================================================================= */
function loadRegForDate(date){
  state.reg.date=date;
  const ex=DB.recordFor(state.account.id,date);
  if(ex){
    state.reg.items=JSON.parse(JSON.stringify(ex.items||[]));
    state.reg.minutes=ex.durationMin||DB.settings().sessionMinutes;
    state.reg.attendees=ex.attendees||""; state.reg.note=ex.note||"";
    state.reg.photos=Array.isArray(ex.photos)?ex.photos.slice():[];
    if(ex.season) state.reg.seasonOn=true;
  }else{
    const team=DB.team(state.teamId);
    state.reg.items=genDay(team?team.contentCat:"all", parseYmd(date).getMonth()+1, state.reg.seasonOn);
    state.reg.attendees=""; state.reg.note=""; state.reg.photos=[];
  }
}
function regRegenAll(){
  const team=DB.team(state.teamId);
  state.reg.items=genDay(team?team.contentCat:"all", parseYmd(state.reg.date).getMonth()+1, state.reg.seasonOn);
  renderRegItems();
}
function addRegPhotos(files){
  const arr=Array.from(files||[]); if(!arr.length) return;
  state.reg.photos=state.reg.photos||[];
  const MAX=6, remain=MAX-state.reg.photos.length;
  if(remain<=0){ toast(`사진은 최대 ${MAX}장까지 첨부할 수 있습니다.`); return; }
  const todo=arr.slice(0,remain);
  let pending=todo.length;
  const done=()=>{ if(--pending<=0) renderView(); };
  if(REMOTE.enabled) toast("사진 업로드 중…");
  todo.forEach(file=>{
    if(!/^image\//.test(file.type||"")){ done(); return; }
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        try{
          const max=1000; let w=img.width, h=img.height;
          if(w>max||h>max){ if(w>=h){ h=Math.round(h*max/w); w=max; } else { w=Math.round(w*max/h); h=max; } }
          const cv=document.createElement("canvas"); cv.width=w; cv.height=h;
          cv.getContext("2d").drawImage(img,0,0,w,h);
          const dataUrl=cv.toDataURL("image/jpeg",0.7);
          if(REMOTE.enabled && cv.toBlob){
            cv.toBlob(blob=>{
              if(!blob){ state.reg.photos.push(dataUrl); done(); return; }
              REMOTE.uploadPhoto(blob, state.account&&state.account.id, state.reg.date)
                .then(url=>{ state.reg.photos.push(url); })
                .catch(e=>{ console.warn("photo:",e); state.reg.photos.push(dataUrl); toast("사진 업로드 실패 — 기기에 임시 저장했습니다."); })
                .then(done);
            }, "image/jpeg", 0.7);
          } else { state.reg.photos.push(dataUrl); done(); }
        }catch(e){ state.reg.photos.push(reader.result); done(); }
      };
      img.onerror=done; img.src=reader.result;
    };
    reader.onerror=done; reader.readAsDataURL(file);
  });
}
function openPhoto(src){ const lb=$("#lightbox"); if(!lb||!src) return;
  lb.innerHTML=`<button class="lb-x" data-act="closePhoto" title="닫기">×</button><img src="${src}" alt="현장 사진">`;
  lb.classList.add("on"); }
function closePhoto(){ const lb=$("#lightbox"); if(lb){ lb.classList.remove("on"); lb.innerHTML=""; } }
function regSaveNow(){
  if(state.reg.date > todayYmd()){
    toast("미래 날짜는 등록할 수 없습니다. 실시한 날짜(오늘까지)로 등록해 주세요.");
    const el=$('[data-f=regDate]'); if(el){ el.focus(); }
    return;
  }
  if(!state.reg.attendees || !String(state.reg.attendees).trim()){
    toast("참석자는 필수 입력 항목입니다."); const el=$('[data-f=regAtt]'); if(el){ el.focus(); }
    return;
  }
  const dObj=parseYmd(state.reg.date);
  const season=state.reg.seasonOn?seasonOf(dObj.getMonth()+1):null;
  const min=+state.reg.minutes||DB.settings().sessionMinutes;
  const existed=!!DB.recordFor(state.account.id,state.reg.date);
  DB.addRecord({
    date:state.reg.date, accountId:state.account.id, teamId:state.teamId, supervisor:state.account.name,
    durationMin:min, items:JSON.parse(JSON.stringify(state.reg.items||[])),
    attendees:String(state.reg.attendees).trim(), note:state.reg.note,
    photos:Array.isArray(state.reg.photos)?state.reg.photos.slice():[], season
  });
  toast(existed?"수정 저장했습니다.":"TBM을 등록했습니다.");
  renderView();
}

function doExport(){
  const blob=new Blob([DB.exportAll()],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
  a.download=`TBM_데이터백업_${todayYmd()}.json`; a.click(); URL.revokeObjectURL(a.href);
  toast("데이터를 내보냈습니다.");
}
function doImport(file){
  const rd=new FileReader();
  rd.onload=()=>{ try{ DB.importAll(rd.result); toast("데이터를 가져왔습니다."); renderView(); }
    catch(e){ toast("가져오기 실패: 올바른 백업 파일이 아닙니다."); } };
  rd.readAsText(file);
}

/* =========================================================================
   엑셀(.xlsx) 추출 — 외부 라이브러리 없이 순수 생성 (오프라인 동작)
   ZIP(store) + CRC32 + SpreadsheetML
   ========================================================================= */
function _crc32(bytes){ let c, crc=~0;
  for(let i=0;i<bytes.length;i++){ c=(crc^bytes[i])&0xff; for(let k=0;k<8;k++) c=(c&1)?((c>>>1)^0xEDB88320):(c>>>1); crc=(crc>>>8)^c; }
  return (~crc)>>>0; }
function _utf8(str){ return new TextEncoder().encode(str); }
function _u32(v){ return [v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255]; }
function _u16(v){ return [v&255,(v>>>8)&255]; }
function _zip(files){
  const chunks=[], central=[]; let offset=0;
  files.forEach(f=>{
    const name=_utf8(f.name), data=f.data, crc=_crc32(data);
    const local=[].concat([0x50,0x4b,0x03,0x04],_u16(20),_u16(0),_u16(0),_u16(0),_u16(0),
      _u32(crc),_u32(data.length),_u32(data.length),_u16(name.length),_u16(0));
    chunks.push(Uint8Array.from(local),name,data);
    const cen=[].concat([0x50,0x4b,0x01,0x02],_u16(20),_u16(20),_u16(0),_u16(0),_u16(0),_u16(0),
      _u32(crc),_u32(data.length),_u32(data.length),_u16(name.length),_u16(0),_u16(0),_u16(0),_u16(0),_u32(0),_u32(offset));
    central.push({head:Uint8Array.from(cen),name});
    offset+=local.length+name.length+data.length;
  });
  const cenChunks=[]; let cenSize=0;
  central.forEach(c=>{ cenChunks.push(c.head,c.name); cenSize+=c.head.length+c.name.length; });
  const eocd=[].concat([0x50,0x4b,0x05,0x06],_u16(0),_u16(0),_u16(files.length),_u16(files.length),
    _u32(cenSize),_u32(offset),_u16(0));
  const all=chunks.concat(cenChunks,[Uint8Array.from(eocd)]);
  const total=all.reduce((a,u)=>a+u.length,0), out=new Uint8Array(total); let p=0;
  all.forEach(u=>{ out.set(u,p); p+=u.length; });
  return out;
}
function _col(n){ let s=""; n++; while(n>0){ const m=(n-1)%26; s=String.fromCharCode(65+m)+s; n=((n-m-1)/26)|0; } return s; }
function _xmlEsc(v){ return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function _sheetXml(rows){
  let body="";
  rows.forEach((row,ri)=>{
    let cells="";
    row.forEach((val,ci)=>{
      const ref=_col(ci)+(ri+1);
      if(typeof val==="number" && isFinite(val)) cells+=`<c r="${ref}"${ri===0?' s="1"':''}><v>${val}</v></c>`;
      else cells+=`<c r="${ref}" t="inlineStr"${ri===0?' s="1"':''}><is><t xml:space="preserve">${_xmlEsc(val)}</t></is></c>`;
    });
    body+=`<row r="${ri+1}">${cells}</row>`;
  });
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}
function exportXlsx(filename, sheets){
  const files=[];
  files.push({name:"[Content_Types].xml",data:_utf8(
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
${sheets.map((s,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}
</Types>`)});
  files.push({name:"_rels/.rels",data:_utf8(
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`)});
  files.push({name:"xl/workbook.xml",data:_utf8(
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>${sheets.map((s,i)=>`<sheet name="${_xmlEsc(String(s.name).replace(/[\\\/\?\*\[\]:]/g," ").slice(0,31))}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join("")}</sheets>
</workbook>`)});
  files.push({name:"xl/_rels/workbook.xml.rels",data:_utf8(
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${sheets.map((s,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join("")}
<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`)});
  files.push({name:"xl/styles.xml",data:_utf8(
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2"><font><sz val="11"/><name val="맑은 고딕"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="맑은 고딕"/></font></fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0C3221"/></patternFill></fill></fills>
<borders count="1"><border/></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`)});
  sheets.forEach((s,i)=>files.push({name:`xl/worksheets/sheet${i+1}.xml`,data:_utf8(_sheetXml(s.rows))}));
  const bytes=_zip(files);
  const blob=new Blob([bytes],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}
function exportProgressXlsx(){
  const half=halfByKey(state.halfKey);
  const s=DB.settings(), today=todayYmd();
  const accs=DB.userAccounts().filter(a=>a.active);
  if(!accs.length){ toast("추출할 관리감독자 계정이 없습니다."); return; }
  // 시트1: 진행상태 요약
  const sum=[["기준반기","부서","관리감독자","아이디","목표시간(h)","누적시간(h)","잔여시간(h)","실시(회)","미실시(일)","달성률(%)"]];
  accs.forEach(a=>{ const t=DB.team(a.teamId), c=computeAcc(a.id,half);
    sum.push([`${half.y} ${half.label}`, t?t.name:"미지정", a.name, a.username,
      c.target, round1(c.accHours), round1(c.remaining), c.done, c.missed, Math.round(c.pct)]); });
  // 시트2: 일자별 상세 (근무일 기준, 반기 시작~오늘)
  const det=[["날짜","요일","부서","관리감독자","아이디","실시여부","교육시간(분)","참석","위험요인 요약","비고"]];
  const end=new Date(Math.min(new Date().getTime(), half.end.getTime()));
  accs.forEach(a=>{ const t=DB.team(a.teamId);
    workdaysInRange(half.start, end, s.workdays).forEach(key=>{
      if(key>today) return;
      const rec=DB.recordFor(a.id,key), dow=DOW[parseYmd(key).getDay()];
      if(rec){ const smry=(rec.items||[]).map(it=>it.h).filter(Boolean).join(" / ");
        det.push([key,dow,t?t.name:"미지정",a.name,a.username,"실시",rec.durationMin||0,rec.attendees||"",smry,rec.note||""]); }
      else det.push([key,dow,t?t.name:"미지정",a.name,a.username,"미실시","","","",""]);
    }); });
  exportXlsx(`TBM_진행상태_${half.y}_${half.label==="상반기"?"H1":"H2"}_${today}.xlsx`,
    [{name:"진행상태 요약",rows:sum},{name:"일자별 상세",rows:det}]);
  toast("엑셀(진행상태)을 추출했습니다.");
}

/* =========================================================================
   이벤트 바인딩
   ========================================================================= */
/* 클릭 */
document.addEventListener("click", e=>{
  /* 탭 (data-act 없음 → data-act 조기반환 이전에 처리) */
  const tabEl=e.target.closest("[data-tab]");
  if(tabEl){
    if(state.role==="admin") state.adminTab=tabEl.dataset.tab; else state.userTab=tabEl.dataset.tab;
    mount(); return;
  }

  const b=e.target.closest("[data-act]"); if(!b) return;
  const act=b.dataset.act;

  /* 로그인 / 로그아웃 */
  if(act==="login"){ doLogin(); return; }
  if(act==="logout"){ DB.clearSession(); state.role=null; state.account=null; state.teamId=null; mount(); return; }
  if(act==="closeModal"){ closeModal(); return; }

  /* 캘린더 이동 */
  if(act==="calPrev"){ state.calM--; if(state.calM<1){state.calM=12;state.calY--;} renderView(); return; }
  if(act==="calNext"){ state.calM++; if(state.calM>12){state.calM=1;state.calY++;} renderView(); return; }
  if(act==="calToday"){ const n=new Date(); state.calY=n.getFullYear(); state.calM=n.getMonth()+1; renderView(); return; }

  /* 등록 */
  if(act==="regGen"){ regRegenAll(); return; }
  if(act==="regRegen"){
    const i=+b.dataset.i, team=DB.team(state.teamId);
    state.reg.items[i]=regenOne(team?team.contentCat:"all", parseYmd(state.reg.date).getMonth()+1, state.reg.seasonOn, state.reg.items, i);
    renderRegItems(); return;
  }
  if(act==="regSave"){ regSaveNow(); return; }
  if(act==="regDelete"){ const ex=DB.recordFor(state.teamId,state.reg.date); if(ex){ DB.delRecord(ex.id); state.reg.items=null; ensureRegItems(); toast("등록을 취소했습니다."); renderView(); } return; }
  if(act==="regPrint"){
    printRecObj({date:state.reg.date, teamId:state.teamId, supervisor:state.account.name, durationMin:+state.reg.minutes||10, items:state.reg.items, attendees:state.reg.attendees, note:state.reg.note, season:state.reg.seasonOn?seasonOf(parseYmd(state.reg.date).getMonth()+1):null});
    return;
  }

  /* 상세 / 기록 */
  if(act==="viewRec"){ const r=DB.records().find(x=>x.id===b.dataset.id); if(r) openModal("TBM 상세", recDetailHTML(r)); return; }
  if(act==="viewDay"){ openModal(fmtK(b.dataset.date)+" 부서별 실시현황", dayDetailHTML(b.dataset.date)); return; }
  if(act==="printRec"){ const r=DB.records().find(x=>x.id===b.dataset.id); if(r) printRecObj(r); return; }
  if(act==="delRec"||act==="delRecModal"){ DB.delRecord(b.dataset.id); closeModal(); toast("삭제했습니다."); renderView(); return; }

  /* 대시보드 → 일별 이동 */
  if(act==="gotoDaily"){ state.adminTab="daily"; state.calTeam=b.dataset.acc||"all"; mount(); return; }

  /* 콘텐츠 */
  if(act==="addItem"){
    const host=$("#viewhost");
    const h=host.querySelector('[data-add=h]').value.trim(), m=host.querySelector('[data-add=m]').value.trim();
    if(!h||!m){ toast("위험요인과 대책을 모두 입력해 주세요."); return; }
    const all=DB.custom(); (all[state.cmCat]=all[state.cmCat]||[]).push([h,m]); DB.saveCustom(all);
    toast("콘텐츠를 추가했습니다."); renderView(); return;
  }
  if(act==="delItem"){
    const all=DB.custom(); const arr=all[state.cmCat]||[]; const idx=arr.findIndex(p=>p[0]===b.dataset.h);
    if(idx>=0){ arr.splice(idx,1); DB.saveCustom(all); toast("삭제했습니다."); renderView(); } return;
  }

  /* 설정 */
  if(act==="saveSettings"){
    const s=DB.settings();
    $$("[data-set]").forEach(el=>{ const k=el.dataset.set; s[k]= el.type==="number" ? (+el.value||0) : el.value; });
    $$("[data-set-bool]").forEach(el=>{ s[el.dataset.setBool]=el.checked; });
    const wd=$$("[data-dow]").filter(el=>el.checked).map(el=>+el.dataset.dow).sort((a,b)=>a-b);
    s.workdays= wd.length?wd:[1,2,3,4,5];
    DB.saveSettings(s); state.reg.minutes=s.sessionMinutes; state.reg.seasonOn=s.seasonDefaultOn;
    toast("설정을 저장했습니다."); renderView(); return;
  }
  if(act==="addTeam"){ const t=DB.teams(); t.push({id:"t"+Date.now(),name:"새 부서",contentCat:"all"}); DB.saveTeams(t); renderView(); return; }
  if(act==="addTeamNamed"){
    const nm=$("#ntName").value.trim(), cat=$("#ntCat").value;
    if(!nm){ toast("부서명을 입력해 주세요."); const el=$("#ntName"); if(el) el.focus(); return; }
    const t=DB.teams();
    if(t.some(x=>x.name===nm)){ toast("이미 같은 이름의 부서가 있습니다."); return; }
    t.push({id:"t"+Date.now(), name:nm, contentCat:cat||"all"}); DB.saveTeams(t);
    toast(`'${nm}' 부서를 추가했습니다.`); renderView(); return;
  }
  if(act==="delTeam"){ const t=DB.teams(); if(t.length<=1){ toast("최소 1개 부서가 필요합니다."); return; } t.splice(+b.dataset.i,1); DB.saveTeams(t); toast("부서를 삭제했습니다."); renderView(); return; }
  if(act==="saveTeams"){
    const t=DB.teams();
    $$("[data-team-i]").forEach(el=>{ const i=+el.dataset.teamI,k=el.dataset.teamK; if(t[i]) t[i][k]=el.value.trim(); });
    DB.saveTeams(t); toast("부서 정보를 저장했습니다."); renderView(); return;
  }

  /* 계정 관리 */
  if(act==="accAdd"){
    const name=$("#naName").value.trim(), user=$("#naUser").value.trim(), pw=$("#naPw").value.trim();
    const teamId=$("#naTeam").value, tg=$("#naTarget").value.trim();
    if(!name||!user||!pw){ toast("이름·아이디·비밀번호를 모두 입력해 주세요."); return; }
    if(DB.accountByUser(user)){ toast("이미 존재하는 아이디입니다."); return; }
    DB.addAccount({ username:user, pass:hashPw(pw), name, teamId, role:"user", targetHours: tg?+tg:null });
    toast("관리감독자 계정을 추가했습니다."); renderView(); return;
  }
  if(act==="accDel"){
    openModal("계정 삭제", `<p><b>${esc(DB.account(b.dataset.id)?.name||"")}</b> 계정을 삭제할까요? 이미 등록된 TBM 기록은 유지되지만, 이 관리감독자는 현황·경보 집계에서 제외됩니다.</p>
      <div class="btn-row" style="margin-top:16px"><button class="btn danger" data-act="accDelConfirm" data-id="${b.dataset.id}">삭제</button><button class="btn" data-act="closeModal">취소</button></div>`);
    return;
  }
  if(act==="accDelConfirm"){ DB.delAccount(b.dataset.id); closeModal(); toast("계정을 삭제했습니다."); renderView(); return; }
  if(act==="accSaveAll"){
    const accs=DB.accounts();
    let dup=null;
    // 아이디 중복 사전 검사
    const rows=$$('[data-acc-row]');
    const seen={};
    rows.forEach(row=>{ const uEl=row.querySelector('[data-ax=username]'); if(uEl){ const u=uEl.value.trim().toLowerCase(); if(u){ if(seen[u]) dup=u; seen[u]=(seen[u]||0)+1; } } });
    // 기존 다른 계정과의 충돌은 저장 시 개별 확인
    if(dup){ toast("중복된 아이디가 있습니다: "+dup); return; }
    rows.forEach(row=>{
      const id=row.dataset.accRow; const a=accs.find(x=>x.id===id); if(!a) return;
      const g=k=>{ const el=row.querySelector(`[data-ax=${k}]`); return el; };
      const nameEl=g("name"), userEl=g("username"), teamEl=g("teamId"), tgEl=g("targetHours"), actEl=g("active"), pwEl=g("newpw");
      if(nameEl) a.name=nameEl.value.trim()||a.name;
      if(userEl){ const nu=userEl.value.trim(); if(nu){ const other=accs.find(x=>x.id!==id && String(x.username).toLowerCase()===nu.toLowerCase()); if(!other) a.username=nu; } }
      if(teamEl) a.teamId=teamEl.value;
      if(tgEl) a.targetHours = tgEl.value.trim()===""?null:(+tgEl.value||0);
      if(actEl) a.active=actEl.checked;
      if(pwEl && pwEl.value.trim()) a.pass=hashPw(pwEl.value.trim());
    });
    DB.saveAccounts(accs); toast("계정 정보를 저장했습니다."); renderView(); return;
  }
  if(act==="accSaveOne"){
    const accs=DB.accounts(); const id=b.dataset.id; const a=accs.find(x=>x.id===id); if(!a) return;
    const row=b.closest('[data-acc-row]'); if(!row) return;
    const nameEl=row.querySelector('[data-ax=name]'), userEl=row.querySelector('[data-ax=username]'), pwEl=row.querySelector('[data-ax=newpw]');
    if(nameEl) a.name=nameEl.value.trim()||a.name;
    if(userEl){ const nu=userEl.value.trim(); if(nu){ const other=accs.find(x=>x.id!==id && String(x.username).toLowerCase()===nu.toLowerCase()); if(other){ toast("이미 존재하는 아이디입니다."); return; } a.username=nu; } }
    if(pwEl && pwEl.value.trim()) a.pass=hashPw(pwEl.value.trim());
    DB.saveAccounts(accs);
    if(state.account && state.account.id===id) state.account=DB.account(id);
    toast("저장했습니다."); renderView(); return;
  }
  if(act==="syncNow"){ if(REMOTE.enabled){ toast("동기화 중…"); REMOTE.loadAll().then(()=>{ REMOTE.degraded=false; mirrorCacheToLocal(); _lastSig=remoteSig(); mount(); toast("최신 상태로 동기화했습니다."); }).catch(()=>toast("동기화 실패 — 서버(함수) 배포 상태를 확인하세요.")); } return; }
  if(act==="exportXlsx"){ exportProgressXlsx(); return; }
  if(act==="regPhotoDel"){ const i=+b.dataset.i; if(state.reg.photos&&i>=0){ state.reg.photos.splice(i,1); renderView(); } return; }
  if(act==="viewPhoto"){ const r=DB.records().find(x=>x.id===b.dataset.rid); const i=+b.dataset.i; if(r&&r.photos&&r.photos[i]) openPhoto(r.photos[i]); return; }
  if(act==="closePhoto"){ closePhoto(); return; }
  if(act==="recReset"){ state.recSearch=""; state.recFrom=""; state.recTo=""; state.recDept="all"; state.recTeam="all"; state.recSeason="all"; state.recSort="desc"; renderView(); return; }
  if(act==="exportData"){ doExport(); return; }
  if(act==="importData"){ $("#importFile").click(); return; }
  if(act==="resetData"){
    openModal("전체 초기화", `<p>모든 설정·부서·TBM 기록·직접입력 콘텐츠가 삭제되고 초기 상태로 되돌아갑니다. 계속할까요?</p>
      <div class="btn-row" style="margin-top:16px"><button class="btn danger" data-act="resetConfirm">네, 초기화합니다</button><button class="btn" data-act="closeModal">취소</button></div>`);
    return;
  }
  if(act==="resetConfirm"){ DB.resetAll(); closeModal(); toast("초기화했습니다."); renderView(); return; }
});

/* 변경 (select / checkbox / date) */
document.addEventListener("change", e=>{
  const t=e.target, f=t.dataset.f;
  if(f==="regDate"){
    let v=t.value;
    if(v && v>todayYmd()){ v=todayYmd(); t.value=v; toast("미래 날짜는 선택할 수 없습니다. 오늘로 설정했습니다."); }
    loadRegForDate(v); renderView(); return;
  }
  if(f==="cmCat"){ state.cmCat=t.value; renderView(); return; }
  if(f==="calTeam"){ state.calTeam=t.value; renderView(); return; }
  if(f==="recTeam"){ state.recTeam=t.value; renderView(); return; }
  if(f==="recDept"){ state.recDept=t.value; renderView(); return; }
  if(f==="recSeason"){ state.recSeason=t.value; renderView(); return; }
  if(f==="recSort"){ state.recSort=t.value; renderView(); return; }
  if(f==="recFrom"){ state.recFrom=t.value; renderView(); return; }
  if(f==="recTo"){ state.recTo=t.value; renderView(); return; }
  if(t.id==="regPhotoInput"){ addRegPhotos(t.files); t.value=""; return; }
  if(f==="halfKey"){ state.halfKey=t.value; renderView(); return; }
  if(t.dataset.act==="regSeason"){ state.reg.seasonOn=t.checked; regRegenAll(); renderView(); return; }
  if(t.dataset.dow!=null){ const lab=t.closest("label"); if(lab) lab.classList.toggle("on",t.checked); return; }
  if(t.id==="importFile"){ if(t.files&&t.files[0]) doImport(t.files[0]); return; }
});

/* 입력 (실시간 바인딩) */
document.addEventListener("input", e=>{
  const t=e.target, f=t.dataset.f;
  if(t.dataset.ri!=null){ const i=+t.dataset.ri,k=t.dataset.rk; if(state.reg.items&&state.reg.items[i]) state.reg.items[i][k]=t.value; return; }
  if(f==="regMin"){ state.reg.minutes=+t.value||DB.settings().sessionMinutes; return; }
  if(f==="regAtt"){ state.reg.attendees=t.value; return; }
  if(f==="regNote"){ state.reg.note=t.value; return; }
  if(f==="cmSearch"){ state.cmSearch=t.value; renderView(); const s=$('[data-f=cmSearch]'); if(s){ s.focus(); s.setSelectionRange(s.value.length,s.value.length); } return; }
  if(f==="recSearch"){ state.recSearch=t.value; renderView(); const s=$('[data-f=recSearch]'); if(s){ s.focus(); s.setSelectionRange(s.value.length,s.value.length); } return; }
});

/* 모달 배경 클릭 닫기 */
$("#modal").addEventListener("click", e=>{ if(e.target.id==="modal") closeModal(); });
/* 사진 라이트박스 배경 클릭 닫기 */
(function(){ const lb=$("#lightbox"); if(lb) lb.addEventListener("click", e=>{ if(e.target.id==="lightbox") closePhoto(); }); })();

/* 키보드: Enter 로그인 / Esc 닫기 */
document.addEventListener("keydown", e=>{
  if(e.key==="Enter" && (e.target.id==="loginUser" || e.target.id==="loginPw")){ e.preventDefault(); doLogin(); return; }
  if(e.key==="Escape"){
    const lb=$("#lightbox"); if(lb && lb.classList.contains("on")){ closePhoto(); return; }
    const m=$("#modal"); if(m && m.classList.contains("on")){ closeModal(); }
  }
});

/* =========================================================================
   부팅
   ========================================================================= */
function boot(){
  DB.accounts(); // 최초 시드 및 기존기록 마이그레이션 보장
  const sess=DB.session();
  if(sess && sess.accountId){
    const a=DB.account(sess.accountId);
    if(a && a.active){ state.account=a; state.role=a.role; state.teamId=a.teamId; }
  }
  const s=DB.settings(); state.reg.minutes=s.sessionMinutes; state.reg.seasonOn=s.seasonDefaultOn;
  mount();
}

/* 원격 변경 수신 시 화면 갱신(입력 중이거나 변경 없으면 건너뜀) */
let _refreshT=null, _lastSig=null;
function remoteSig(){
  try{
    const recs=raw.get("records",[]);
    return recs.length+"|"+recs.map(r=>r.id+":"+(r.updatedAt||0)).join(",")+"|"+
      JSON.stringify(raw.get("settings",{}))+"|"+JSON.stringify(raw.get("teams",[]))+"|"+
      (raw.get("accounts",[])||[]).map(a=>a.id+":"+(a.active?1:0)+":"+(a.targetHours||"")).join(",");
  }catch(e){ return Math.random().toString(); }
}
function scheduleRefresh(){
  clearTimeout(_refreshT);
  _refreshT=setTimeout(()=>{
    const wasDegraded = !!REMOTE.degraded;
    REMOTE.loadAll().then(()=>{
      REMOTE.degraded=false;
      mirrorCacheToLocal();
      const sig=remoteSig();
      const badgeChanged = wasDegraded; // 서버 재연결 → 상단 배지 갱신 필요
      if(sig===_lastSig && !badgeChanged) return;   // 변경 없음 → 재렌더 생략
      const ae=document.activeElement;
      const typing = ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName||"");
      const editingModal = $("#modal") && $("#modal").classList.contains("on");
      if(typing || editingModal) return;            // 입력/모달 중이면 보류(다음 주기에 재시도)
      _lastSig=sig;
      if(badgeChanged) mount();                      // 배지 포함 전체 갱신
      else renderView();                             // 데이터만 현재 화면 갱신(스크롤 유지)
    }).catch(()=>{});
  }, 400);
}

if(REMOTE.enabled){
  // 공유 모드: 데이터 로드 후 부팅 + 구독(실시간/폴링)
  document.getElementById("gate").innerHTML =
    '<div class="gate-card login"><div class="org-name">데이터 동기화 중…</div>'+
    '<h2>TBM 통합관리 시스템</h2><p>서버에서 최신 데이터를 불러오는 중입니다.</p></div>';
  document.getElementById("gate").classList.remove("hide");
  REMOTE.loadAll()
    .then(()=>{ mirrorCacheToLocal(); _lastSig=remoteSig(); boot(); REMOTE.subscribe(scheduleRefresh); })
    .catch(err=>{
      console.warn("remote load failed:", err);
      REMOTE.degraded = true;      // 서버 미연결 상태
      hydrateCacheFromLocal();     // 로컬 저장본으로 복구(유실 방지)
      boot();
      toast("서버에 연결하지 못했습니다. 데이터는 이 기기에 저장되며, 배포(함수) 상태를 확인하세요.");
    });
} else {
  boot();
}

})();
