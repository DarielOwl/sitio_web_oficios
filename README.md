# sitio_web_oficios

###  Comandos utiles:

0) Instalar servidor Express para que levante el proyecto
- npm install express

1) Instalar las librerias de Mongo (mongoose)
- npm install mongoose

2) Instalar las librerias de node
- npm install

3) Remover cache: 
- rm -rf node_modules package-lock.json

4) Desinstalar tailwin 
- npm uninstall tailwindcss

5) Instalar Tailwin version 3 
- npm install -D tailwindcss@3.4.14

6) Iniciar Tailwin
- npx tailwindcss init -p

7) Compilar los archivos para que tengan tailwin 
- npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
- npx tailwindcss -i ./public/css/tailwind.css -o ./public/css/output.css --watch

8) Instalar las librerias de .env (dotenv)
- npm install dotenv

9) Instalar las librerias de middleware (logs)
- npm install morgan

10) Instalar las librerias de plantillas EJS
- npm install ejs

10) Instalar las librerias de express-session
- npm install express-session bcrypt



# Inster datos DB
1) docker exec -it sitio-web-oficial-mongodb mongosh -u admin -p admin123
2) use sitio_oficios
1) db.proveedors.insertMany([
{
  nombre: 'Carlos Mendoza',
  zona: 'Centro - 3km',
  descripcion: 'Plomero con 15 años de experiencia.',
  contacto: { whatsapp: '5491122223333' }
},
{
  nombre: 'Ana Rodríguez',
  zona: 'Norte - 4km',
  descripcion: 'Electricista residencial y comercial.',
  contacto: { whatsapp: '5491144445555' }
}
])

