import { Button } from '../components/Ui/Button'
import { PlusIcon } from '../components/Ui/Icons/plus'

import '../App.css'
import { ShareIcon } from '../components/Ui/Icons/share'
import { Card } from '../components/Ui/Card'
import { CreateContentModel } from '../components/Ui/CreateContentModel'
import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from '../components/Ui/Sidebar'
import axios from 'axios'
import { BackendUrl } from '../config'
import { useContent } from '../hooks/useContent'

export function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false);
  const [emailState, setEmailState] = useState<string>(() => localStorage.getItem('email') || '');
  const email = useMemo(() => emailState, [emailState]);
  const { content, loading, error, refetch } = useContent();

  useEffect(() => {
    // If we don't have an email yet but we are authed, fetch from backend
    const token = localStorage.getItem('token');
    if (!emailState && token) {
      axios.get(`${BackendUrl}/me`).then((res) => {
        const fetchedEmail = res.data?.email as string | undefined;
        if (fetchedEmail) {
          localStorage.setItem('email', fetchedEmail);
          setEmailState(fetchedEmail);
        }
      }).catch(() => {
        // ignore errors silently for welcome message
      });
    }
  }, [emailState]);

  
  return (
    <div>
      <Sidebar />
   <div className='bg-[#020817] h-screen ml-64' >
    <CreateContentModel
      open={modelOpen}
      onClose={() => {
        setModelOpen(false);
      }}
      onSuccess={() => {
        // refresh content after successful add
        refetch();
      }}
    />
    <div className='px-2 pt-6 flex justify-between items-center'>
      <div className='ml-7'>
        <div className='text-[#d9dbe0] font-sans text-xl'>
          {email ? `Welcome, ${email}` : 'Welcome'}
        </div>
        <div className='text-[#d9dbe0] font-sans text-3xl font-semibold'>
          All Notes
        </div>
      </div> 
      <div className='flex space-x-4'>
        <Button startIcon={<ShareIcon/>} size='md' variant="primary" text="Share MemoX" />
        <Button onClick={() => {
          setModelOpen(true);
        }} startIcon={<PlusIcon/>} size='md' variant="secondary" text="Add Content" />
      </div>
    </div>    
    
    
    <div className='flex space-x-2 px-2 pt-6 ml-7'>
      {loading && (
        <div className='text-slate-300'>Loading...</div>
      )}
      {!loading && error && (
        <div className='text-red-400'>Failed to load content</div>
      )}
      {!loading && !error && content?.length === 0 && (
        <div className='text-slate-300'>No content yet. Click "Add Content" to get started.</div>
      )}
      {!loading && !error && content?.map((item: any) => {
        const { type, link, title } = item || {};
        const key = item?.id || item?._id || `${type}:${link}`;
        return (
          <Card key={key} type={type} link={link} title={title || ''} />
        );
      })}
    </div>
   
    
   </div>
   </div>
 
  )
}

