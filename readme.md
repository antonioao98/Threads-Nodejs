# Threads em node JS

Script desenvolvido para fazer a atualização de 70140 registros no mongoDB, onde os dados que serão atualizados estavam em outra collection e para fazer com que essa atualização dos registros seja mais rápida foi feito uma otimização na consulta da query ao banco e o script foi desenvolvido para utilizar mais de uma thread.<br><br>

### **Resultados utilizando uma CPU com 8 threads**<br><br>
Uma única thread<br>

19:04 --> Horário que o script começou<br>

19:47 --> Horário que o script acabou<br><br>
Resultado: 43 min

---
Com várias threads<br>

19:52 --> Horário que o script começou<br>

20:16 --> Horário que o script acabou<br><br>
Resultado: 24 min

---
## Instalação

Use o gerenciador de pacote do node ([npm](https://nodejs.org/en/)) para instalar as dependências necessárias para rodar o projeto 

```javascript
npm i
```

## Usage

Para rodar com várias threads:

```javascript
npm start
```
Para rodar com uma única threads:
```javascript
npm start2
```

## Pessoas envolvidas

- [Antônio Aragão](https://github.com/antonioao98)
- [Celso dias](https://github.com/celsodias12)

## License

[MIT](https://choosealicense.com/licenses/mit/)