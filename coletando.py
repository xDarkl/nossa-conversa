import re
from collections import Counter
from datetime import datetime

mensagens = []

with open("conversa.txt", "r", encoding="utf-8") as f:
    for linha in f:
        padrao = r"(\d{2}/\d{2}/\d{4}) (\d{2}:\d{2}) - (.*?): (.*)"
        match = re.match(padrao, linha)
        
        if match:
            data, hora, pessoa, msg = match.groups()
            mensagens.append({
                "data": data,
                "hora": hora,
                "pessoa": pessoa,
                "mensagem": msg
            })
            
#total de mensagens geral
total = len(mensagens)
print("Total:", total)

#total de mensagens por pessoa
por_pessoa = Counter(m["pessoa"] for m in mensagens)
print(por_pessoa)

#horário que mais conversa
horas = [m["hora"][:2] for m in mensagens]
contagem_horas = Counter(horas)

mais_frequente = contagem_horas.most_common(1)
print("Hora mais ativa:", mais_frequente)

#quantos dias diferentes conversamos
dias = set(m["data"] for m in mensagens)
print("Dias conversados:", len(dias))

#quantidade de fotos/figurinhas/gifs
midia = sum(1 for m in mensagens if "<Mídia oculta>" in m["mensagem"])
print("Mídias:", midia)

#palavras chave
chaves = ["eu te amo", "little couto", "abimon", "filhos", "casa", "futuro", "aceitar", "trans"]

resultado = {}

for chave in chaves:
    count = sum(1 for m in mensagens if chave.lower() in m["mensagem"].lower())
    resultado[chave] = count

print(resultado)
