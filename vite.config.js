import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

// دالة تجيب كل ملفات HTML تلقائيًا
function getHtmlInputs() {
  const root = __dirname
  const files = []

  // دور على كل HTML في المشروع
  function scanDir(dir) {
    const entries = fs.readdirSync(dir)
    for (const entry of entries) {
      const fullPath = resolve(dir, entry)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        scanDir(fullPath)
      } else if (entry.endsWith('.html')) {
        // اسم الملف من غير الامتداد
        const name = entry.replace('.html', '')
        files.push([name, fullPath])
      }
    }
  }

  scanDir(root)
  return Object.fromEntries(files)
}

export default defineConfig({
  base: './', // يخلي كل الروابط نسبية
  publicDir: 'public', // كل حاجة في public/ تتنسخ زي ما هي
  build: {
    rollupOptions: {
      input: getHtmlInputs(), // ياخد كل ملفات HTML تلقائي
    },
  },
})
