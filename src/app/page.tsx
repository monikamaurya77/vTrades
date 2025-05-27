// src/app/page.js
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/signin'); // Redirect root URL to signin page
}