import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SaasNav } from '@/components/SaasNav';
import { ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
export default function Access() {
 const nav=useNavigate(); const location=useLocation();
 const signup=location.pathname==='/cadastro'; const recovery=location.pathname==='/reset-password';
 const [forgot,setForgot]=useState(false); const [email,setEmail]=useState('');const [name,setName]=useState('');const [password,setPassword]=useState('');const [busy,setBusy]=useState(false);const [sent,setSent]=useState(false);const [recoveryReady,setRecoveryReady]=useState(false);
 useEffect(()=>{setSent(false);setForgot(false);const hash=new URLSearchParams(window.location.hash.slice(1));if(hash.get('type')==='recovery') setRecoveryReady(true);const {data}=supabase.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY')setRecoveryReady(true);});return()=>data.subscription.unsubscribe();},[location.pathname]);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);try{
 if(recovery){if(!recoveryReady)throw new Error('Abra o link de recuperação recebido por e-mail.');const {error}=await supabase.auth.updateUser({password});if(error)throw error;toast.success('Senha atualizada');nav('/painel');return;}
 if(forgot){const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/reset-password'});if(error)throw error;setSent(true);return;}
 const result=signup?await supabase.auth.signUp({email,password,options:{data:{display_name:name},emailRedirectTo:window.location.origin+'/construir'}}):await supabase.auth.signInWithPassword({email,password});
 if(result.error)throw result.error;
 if(signup&&!result.data.session){setSent(true);return;}
 nav(signup?'/construir'+location.search:'/painel');
 }catch(error){toast.error(error instanceof Error?error.message:'Não foi possível continuar.');}finally{setBusy(false);}}
 return <div className="saas-theme min-h-screen bg-secondary"><SaasNav/><main className="max-w-md mx-auto px-5 py-14"><p className="eyebrow">{signup?'SUA AGENDA COMEÇA AQUI':'BEM-VINDO DE VOLTA'}</p><h1 className="text-3xl font-semibold mt-3">{recovery?'Defina sua nova senha':forgot?'Recuperar acesso':signup?'Vamos organizar seu negócio.':'Entre na sua agenda.'}</h1><p className="text-muted-foreground mt-3 mb-8">{signup?'Cinco dias para experimentar. Sem cartão.':'Seu negócio, seus horários, tudo no seu lugar.'}</p>{sent?<div className="space-y-5"><Check className="text-primary h-10 w-10"/><h2 className="font-semibold">Confira seu e-mail</h2><p className="text-muted-foreground text-sm">{forgot?'Enviamos um link para redefinir sua senha.':'Seu cadastro foi recebido. Confirme o e-mail para continuar a criação da agenda.'}</p><Button variant="outline" onClick={()=>setSent(false)}>Voltar</Button></div>:<form onSubmit={submit} className="space-y-5">{signup&&<label className="form-label">Nome do responsável<Input required minLength={2} autoComplete="name" value={name} onChange={e=>setName(e.target.value)}/></label>}{!recovery&&<label className="form-label">E-mail<Input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>}{!forgot&&<label className="form-label">{recovery?'Nova senha':'Senha'}<Input type="password" required minLength={8} autoComplete={signup||recovery?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)}/></label>}{!signup&&!recovery&&!forgot&&<Button type="button" variant="link" className="p-0 h-auto" onClick={()=>setForgot(true)}>Esqueci minha senha</Button>}<Button disabled={busy||(recovery&&!recoveryReady)} className="w-full h-12">{busy?'Aguarde…':recovery?'Salvar senha':forgot?'Enviar link':signup?'Criar minha conta':'Entrar'}<ArrowRight className="ml-2 h-4 w-4"/></Button></form>}<p className="mt-7 text-sm text-muted-foreground">{signup?'Já tem uma conta?':'Ainda não tem uma conta?'} <Link className="text-primary font-medium" to={signup?'/entrar':'/cadastro'}>{signup?'Entrar':'Experimente grátis'}</Link></p></main></div>;
}