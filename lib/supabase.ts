import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wsixvibyluybfbwhozzt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzaXh2aWJ5bHV5YmZid2hvenp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzM3MzYsImV4cCI6MjA5MzY0OTczNn0.w-GGveiNHRmJmIhJO3kQSwJ_sFyxQFT3Ca2MfuAFMSo'

export const supabase = createClient(supabaseUrl, supabaseKey)