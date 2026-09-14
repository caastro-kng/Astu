import {useEffect,useState} from "react";import{Bell,CalendarDays,ChevronLeft,Download,Flag,LayoutDashboard,Menu,Plus,Repeat2,Settings,Trash2,TrendingUp,Wallet}from"lucide-react";import{Bar,BarChart,Cell,ResponsiveContainer,Tooltip,XAxis,YAxis}from"recharts";import{useFinance}from"../../features/finance/use-finance";import{activeMonthly,formatCurrency,grouped,id,progress,today,totals}from"../../features/finance/utils";import type{FinanceData,TransactionType}from"../../features/finance/types";
const nav=[["/app","Visão geral",LayoutDashboard],["/app/movimentos","Receitas e despesas",Wallet],["/app/assinaturas","Assinaturas",Repeat2],["/app/metas","Metas",Flag],["/app/relatorios","Relatórios",TrendingUp],["/app/configuracoes","Configurações",Settings]]as const;const categories=["Casa","Alimentação","Transporte","Saúde","Educação","Lazer","Assinaturas","Outros","Salário","Renda extra"];
function Empty({title,text,add}:{title:string;text:string;add?:()=>void}){return <div className="empty"><span>Astú</span><h2>{title}</h2><p>{text}</p>{add&&<button onClick={add}><Plus size={17}/>Adicionar agora</button>}</div>};function Metrics({data}:{data:FinanceData}){const t=totals(data.transactions);return <div className="metric-grid-app"><article><span>Saldo disponível</span><strong>{formatCurrency(t.balance)}</strong></article><article><span>Receitas</span><strong className="income">{formatCurrency(t.income)}</strong></article><article><span>Despesas</span><strong className="expense">{formatCurrency(t.expenses)}</strong></article><article><span>Economia do mês</span><strong>{t.rate.toFixed(0)}%</strong></article></div>}
function Form({close,save}:{close:()=>void;save:(t:TransactionType,d:string,a:number,c:string,date:string)=>void}){const[t,setT]=useState<TransactionType>("expense"),[d,setD]=useState(""),[a,setA]=useState(""),[c,setC]=useState(categories[0]),[date,setDate]=useState(today());return <div className="modal-backdrop"><form className="modal finance-form" onSubmit={e=>{e.preventDefault();const cents=Math.round(Number(a.replace(',','.'))*100);if(d&&cents>0)save(t,d,cents,c,date)}}><button className="modal-close" type="button" onClick={close}>×</button><h2>Novo movimento</h2><div className="type-switch"><button type="button" className={t==='expense'?'active':''} onClick={()=>setT('expense')}>Despesa</button><button type="button" className={t==='income'?'active income':''} onClick={()=>setT('income')}>Receita</button></div><label>Descrição<input required value={d} onChange={e=>setD(e.target.value)}/></label><label>Valor<input required inputMode="decimal" value={a} onChange={e=>setA(e.target.value)} placeholder="0,00"/></label><label>Categoria<select value={c} onChange={e=>setC(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label>Data<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><button className="primary">Salvar movimento</button></form></div>}
function Overview({data,add}:{data:FinanceData;add:()=>void}){if(!data.transactions.length)return <Empty title="Vamos organizar sua vida financeira?" text="Adicione sua primeira receita ou despesa para começar a acompanhar seu dinheiro." add={add}/>;return <><Metrics data={data}/><section className="content-grid"><article className="panel"><h2>Movimentos recentes</h2>{data.transactions.slice(-5).reverse().map(x=><div className="row" key={x.id}><span>{x.categoryId[0]}</span><b>{x.description}<small>{x.categoryId} · {x.date}</small></b><strong className={x.type}>{x.type==='income'?'+ ':'- '}{formatCurrency(x.amount)}</strong></div>)}</article><article className="insight"><p>Dica da Astú</p><h2>Registre cada movimento para decidir com clareza.</h2><span>Suas metas ajudam a transformar planos em próximos passos.</span></article></section></>}
function Movements({data,setData,add}:{data:FinanceData;setData:(x:FinanceData)=>void;add:()=>void}){const[filter,setFilter]=useState("all"),list=data.transactions.filter(x=>filter==='all'||x.type===filter);return <><div className="page-actions"><div className="filters">{[["all","Todos"],["income","Receitas"],["expense","Despesas"]].map(([v,l])=><button key={v} className={filter===v?'active':''} onClick={()=>setFilter(v)}>{l}</button>)}</div><button className="primary" onClick={add}><Plus size={17}/>Novo movimento</button></div>{!list.length?<Empty title="Você ainda não registrou nenhum movimento." text="Ao adicionar receitas e despesas, a Astú montará seus resumos automaticamente." add={add}/>:<article className="panel table-panel"><div className="table-head"><span>Descrição</span><span>Categoria</span><span>Data</span><span>Valor</span><span>Ações</span></div>{list.map(x=><div className="table-row" key={x.id}><b>{x.description}</b><span>{x.categoryId}</span><span>{x.date}</span><strong className={x.type}>{x.type==='income'?'+ ':'- '}{formatCurrency(x.amount)}</strong><button onClick={()=>{if(confirm('Excluir este movimento?'))setData({...data,transactions:data.transactions.filter(y=>y.id!==x.id)})}}>Excluir</button></div>)}</article>}</>}
function Subscriptions({data,setData}:{data:FinanceData;setData:(x:FinanceData)=>void}) {
  const services=[
    {name:"Outro serviço",price:""},
    {name:"Netflix",price:"44,90"},
    {name:"Disney+",price:"43,90"},
    {name:"Spotify",price:"23,90"},
    {name:"Amazon Prime",price:"19,90"},
    {name:"Max",price:"34,90"},
    {name:"Apple Music",price:"21,90"},
  ];
  const [open,setOpen]=useState(false);
  const [service,setService]=useState("Outro serviço");
  const [name,setName]=useState("");
  const [amount,setAmount]=useState("");
  const [frequency,setFrequency]=useState<"monthly"|"yearly">("monthly");
  const [nextBillingDate,setNextBillingDate]=useState(today());
  const openModal=()=>{setService("Outro serviço");setName("");setAmount("");setFrequency("monthly");setNextBillingDate(today());setOpen(true)};
  const chooseService=(value:string)=>{const preset=services.find(item=>item.name===value);setService(value);setName(value==="Outro serviço"?"":value);setAmount(preset?.price||"")};
  const submit=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const cents=Math.round(Number(amount.replace(".","").replace(",","."))*100);
    const finalName=name.trim();
    const date=new Date(`${nextBillingDate}T12:00:00`);
    const now=new Date().toISOString();
    if(finalName&&cents>0){
      setData({...data,subscriptions:[...data.subscriptions,{id:id(),name:finalName,amount:cents,billingDay:date.getDate(),frequency,active:true,nextBillingDate,createdAt:now,updatedAt:now}]});
      setOpen(false);
    }
  };
  return <>
    <div className="page-actions subscription-actions">
      <div><strong>{formatCurrency(activeMonthly(data.subscriptions))}</strong><span>/mês em cobranças ativas</span></div>
      <button className="primary" onClick={openModal}><Plus size={17}/>Nova assinatura</button>
    </div>
    {!data.subscriptions.length?
      <Empty title="Você ainda não cadastrou assinaturas." text="Adicione serviços e contas recorrentes para acompanhar os próximos vencimentos." add={openModal}/>:
      <div className="subscription-grid">
        {data.subscriptions.map(x=><article className={x.active?"subscription-card":"subscription-card is-paused"} key={x.id}>
          <div className="subscription-card-top"><span className="subscription-mark">{x.name.slice(0,1).toUpperCase()}</span><div><small>{x.active?"ATIVA":"PAUSADA"}</small><h2>{x.name}</h2></div></div>
          <strong>{formatCurrency(x.amount)} <small>/{x.frequency==="monthly"?"mês":"ano"}</small></strong>
          <p><CalendarDays size={15}/>Próxima cobrança: {new Date(`${x.nextBillingDate}T12:00:00`).toLocaleDateString("pt-BR")}</p>
          <div className="subscription-card-actions">
            <button onClick={()=>setData({...data,subscriptions:data.subscriptions.map(y=>y.id===x.id?{...y,active:!y.active}:y)})}>{x.active?"Pausar":"Ativar"}</button>
            <button className="subscription-delete" aria-label={`Excluir ${x.name}`} onClick={()=>{if(confirm("Excluir esta assinatura?"))setData({...data,subscriptions:data.subscriptions.filter(y=>y.id!==x.id)})}}><Trash2 size={16}/></button>
          </div>
        </article>)}
      </div>
    }
    {open&&<div className="modal-backdrop">
      <form className="modal finance-form subscription-modal" onSubmit={submit}>
        <button type="button" className="modal-close" onClick={()=>setOpen(false)}>×</button>
        <span className="modal-eyebrow">Assinaturas</span>
        <h2>Adicionar assinatura</h2>
        <p className="modal-description">Escolha um serviço e um plano para preencher mais rápido, ou cadastre outro livremente.</p>
        <label>Serviço<select value={service} onChange={e=>chooseService(e.target.value)}>{services.map(item=><option key={item.name}>{item.name}</option>)}</select></label>
        <label>Nome da assinatura<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Ex.: academia, jornal, aplicativo"/></label>
        <div className="subscription-form-row">
          <label>Valor<input required inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0,00"/><small>Valor sugerido e sempre editável.</small></label>
          <label>Periodicidade<select value={frequency} onChange={e=>setFrequency(e.target.value as "monthly"|"yearly")}><option value="monthly">Mensal</option><option value="yearly">Anual</option></select></label>
        </div>
        <label>Próxima cobrança<input required type="date" value={nextBillingDate} onChange={e=>setNextBillingDate(e.target.value)}/></label>
        <p className="subscription-hint">ⓘ Preços de referência. Confirme o valor cobrado no seu plano.</p>
        <button className="subscription-save">Salvar assinatura</button>
      </form>
    </div>}
  </>;
}
function Goals({data,setData}:{data:FinanceData;setData:(x:FinanceData)=>void}){const[open,setOpen]=useState(false);return <><div className="page-actions"><p>{data.goals.length} meta(s) ativa(s)</p><button className="primary" onClick={()=>setOpen(true)}><Plus size={17}/>Nova meta</button></div>{!data.goals.length?<Empty title="Qual é o seu próximo objetivo?" text="Crie uma meta e acompanhe cada passo até alcançá-la." add={()=>setOpen(true)}/>:<div className="goal-grid">{data.goals.map(x=><article className="goal" key={x.id}><span>Em andamento</span><h2>{x.name}</h2><strong>{formatCurrency(x.currentAmount)} <small>de {formatCurrency(x.targetAmount)}</small></strong><i><b style={{width:`${progress(x)}%`}}/></i><p>{progress(x).toFixed(0)}% concluído</p><button onClick={()=>setData({...data,goals:data.goals.map(y=>y.id===x.id?{...y,currentAmount:Math.min(y.targetAmount,y.currentAmount+(y.monthlyContribution||0))}:y)})}>Adicionar aporte</button></article>)}</div>}{open&&<div className="modal-backdrop"><form className="modal finance-form" onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget),target=Math.round(Number(String(f.get('target')).replace(',','.'))*100),now=new Date().toISOString();if(target>0){setData({...data,goals:[...data.goals,{id:id(),name:String(f.get('name')),targetAmount:target,currentAmount:0,monthlyContribution:Math.round(Number(String(f.get('monthly')).replace(',','.'))*100)||0,status:'active',createdAt:now,updatedAt:now}]});setOpen(false)}}}><button type="button" className="modal-close" onClick={()=>setOpen(false)}>×</button><h2>Nova meta</h2><label>Nome<input required name="name"/></label><label>Valor-alvo<input required name="target"/></label><label>Aporte mensal<input name="monthly"/></label><button className="primary">Salvar meta</button></form></div>}</>}
function Reports({data}:{data:FinanceData}){const chart=grouped(data.transactions);if(!data.transactions.length)return <Empty title="Seus relatórios aparecerão aqui." text="Registre alguns movimentos para que a Astú identifique padrões e tendências."/>;return <><Metrics data={data}/><article className="panel chart"><h2>Despesas por categoria</h2><ResponsiveContainer width="100%" height={280}><BarChart data={chart}><XAxis dataKey="name"/><YAxis/><Tooltip formatter={v=>formatCurrency(Number(v)*100)}/><Bar dataKey="value">{chart.map((_,i)=><Cell key={i} fill={i%2?'#EA5B1B':'#16856B'}/>)}</Bar></BarChart></ResponsiveContainer></article></>}
function Config({data,setData}:{data:FinanceData;setData:(x:FinanceData)=>void}){return <article className="panel settings-panel"><h2>Preferências</h2><label>Nome de exibição<input value={data.name} onChange={e=>setData({...data,name:e.target.value})}/></label><label><input type="checkbox" checked={data.notificationsEnabled} onChange={e=>setData({...data,notificationsEnabled:e.target.checked})}/>Receber alertas de vencimento</label><button onClick={()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));a.download='astu-backup.json';a.click()}}><Download size={17}/>Exportar backup JSON</button><button className="danger" onClick={()=>{if(confirm('Apagar todos os dados? Esta ação não pode ser desfeita.'))setData({transactions:[],subscriptions:[],goals:[],name:'',notificationsEnabled:true})}}>Apagar dados</button></article>}
export function FinanceApp(){const[data,setData]=useFinance(),[path,setPath]=useState(window.location.pathname),[menu,setMenu]=useState(false),[form,setForm]=useState(false);useEffect(()=>{const h=()=>setPath(window.location.pathname);addEventListener('popstate',h);return()=>removeEventListener('popstate',h)},[]);const title=nav.find(x=>x[0]===path)?.[1]||'Visão geral',save=(type:TransactionType,description:string,amount:number,categoryId:string,date:string)=>{const now=new Date().toISOString();setData({...data,transactions:[...data.transactions,{id:id(),description,amount,type,categoryId,date,status:type==='income'?'received':'paid',createdAt:now,updatedAt:now}]});setForm(false)};return <div className="app-shell"><aside className={menu?'open':''}><a className="app-logo" href="/" aria-label="Voltar para Astú"><img src="/brand/astu/astu-symbol.png" alt=""/><strong>Astú<span>.</span></strong></a><nav>{nav.map(([url,label,Icon])=><a key={url} href={url} className={path===url?'selected':''} onClick={event=>{event.preventDefault();setMenu(false);if(window.location.pathname!==url){window.history.pushState({},'',url);window.dispatchEvent(new PopStateEvent('popstate'))}}}><Icon size={18}/>{label}</a>)}</nav><a href="/" className="back"><ChevronLeft size={17}/>Voltar ao site</a></aside><main className="app-main"><header className="app-header"><button className="hamburger" onClick={()=>setMenu(!menu)} aria-label="Abrir menu"><Menu/></button><div><p>Olá{data.name?`, ${data.name}`:''}</p><h1>{title}</h1><small>{title==='Visão geral'?'Aqui está o resumo do seu dinheiro':'Gerencie suas decisões com clareza'}</small></div><button className="notification" aria-label="Notificações"><Bell size={19}/></button></header>{path==='/app'?<Overview data={data} add={()=>setForm(true)}/>:path==='/app/movimentos'?<Movements data={data} setData={setData} add={()=>setForm(true)}/>:path==='/app/assinaturas'?<Subscriptions data={data} setData={setData}/>:path==='/app/metas'?<Goals data={data} setData={setData}/>:path==='/app/relatorios'?<Reports data={data}/>:<Config data={data} setData={setData}/>}</main>{form&&<Form close={()=>setForm(false)} save={save}/>}</div>}

