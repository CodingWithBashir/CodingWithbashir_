export const dynamicParams = true
export async function generateStaticParams() { return [{ 'id': 'placeholder', 'lessonId': 'placeholder' }] }
import Client from './client'
export default function Page() { return <Client /> }
