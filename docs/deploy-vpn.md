# Deploy pela VPN: timeout no SSH

Os workflows `api/.github/workflows/deploy.yml` e `web/.github/workflows/deploy.yml` conectam na VPN da ATI (`vpnssl.ati.pi.gov.br:443`) com `openfortivpn` e copiam os arquivos com `appleboy/scp-action`. Esse arranjo já publicou o site. O container da action enxerga a rota quando o túnel sobe com as rotas de antes.

O secret `VPN_CERT_HASH` é o SHA-256 do certificado que o gateway apresenta. Sem esse pin, o `openfortivpn` recusa o certificado e o túnel não sobe.

## O que o erro significa

```
dial tcp ***:22: i/o timeout
dial tcp ***:22: connect: no route to host
```

O runner não completou a conexão TCP na porta 22. O bloco `======CMD======` é só o script que a action ia enviar. Ele não chegou a executar no servidor.

`i/o timeout` aparece quando a VPN desse job não sobe: o pacote sai e ninguém responde. `no route to host` aparece quando o túnel sobe e a tabela de rotas não alcança o `SERVER_HOST`. A action é a mesma que funcionava; o que mudou é a rota até o servidor.

O FortiClient local entra por `vpnssl.etipi.pi.gov.br:10344` (perfil VPN-ANTI). O Actions entra por `vpnssl.ati.pi.gov.br:443`. Se o portal da porta 443 deixar de anunciar a rede do servidor, o deploy que já funcionou passa a falhar com `no route to host`.

## Onde olhar

1. Abra o job que falhou, não um job anterior que passou.
2. Leia o log completo de `Setup OpenFortiVPN`.
3. Compare com a tabela abaixo.

| No log da VPN | O que fazer |
| --- | --- |
| `Gateway certificate validation failed` e uma linha `--trusted-cert <hash>` | Atualize o secret `VPN_CERT_HASH` com esse hash. Passos na seção seguinte. |
| `Login failed`, `Could not authenticate`, `Two-factor` | Confira `VPN_USERNAME` e `VPN_PASSWORD` no mesmo repositório. |
| `Tunnel is up` e o SSH expira mesmo assim | O pin foi aceito. Siga a seção "Túnel subiu e o SSH expirou". |
| Log vazio ou só o `apt-get` | O processo morreu antes de imprimir. Rode o `openssl` abaixo e confira o secret. |

No repositório **api** há dois jobs (`upload` e `deploy`), cada um com o próprio `Setup OpenFortiVPN` e um runner novo. O `upload` ter passado não garante que o `deploy` conectou de novo. No **web** o túnel é o do job `deploy`.

## Atualizar o `VPN_CERT_HASH`

O hash que o gateway mandar no erro já vem no formato do secret: hexadecimal contínuo, sem dois-pontos. Pode colar em maiúsculas ou minúsculas.

Para ler o certificado da sua máquina:

```bash
echo | openssl s_client -connect vpnssl.ati.pi.gov.br:443 -servername vpnssl.ati.pi.gov.br 2>/dev/null \
  | openssl x509 -noout -fingerprint -sha256 -subject -dates
```

Saída típica:

```
sha256 Fingerprint=8C:06:34:10:...
subject=CN = etipi.pi.gov.br
notBefore=...
notAfter=...
```

Monte o valor do secret: pegue o fingerprint, apague os `:`, e deixe em minúsculas. Exemplo do certificado visto em 26 nov 2026 (`CN = etipi.pi.gov.br`, válido até 21 out 2026):

```
8c063410b242eff58c4c15b950774d12c49205127726b14d64273ba8fc2ff8b3
```

Atualize o secret nos dois repositórios. Os deploys não compartilham secrets.

- [observatorio-ufpi/api](https://github.com/observatorio-ufpi/api/settings/secrets/actions) → Actions → `VPN_CERT_HASH`
- [observatorio-ufpi/web](https://github.com/observatorio-ufpi/web/settings/secrets/actions) → Actions → `VPN_CERT_HASH`

Settings → Secrets and variables → Actions → edite `VPN_CERT_HASH`. Não crie outro nome.

Depois: Actions → workflow que falhou → **Re-run failed jobs**.

- API: `Deploy Backend API` (`workflow_dispatch` ou push na `main`)
- Web: `Deploy Observatorio`

## Túnel subiu e o SSH expirou

O log da VPN desse job mostra `Tunnel is up`, ou o step anterior de `scp` no mesmo job passou, e ainda assim a porta 22 estoura.

1. Confira `SERVER_HOST` e `SERVER_USER`. O host precisa ser o IP alcançável pela VPN, com SSH na porta 22.
2. Veja se o log da VPN segue com erro de `pppd` ou se a interface cai antes do step de SSH. O cliente fica em background entre os steps; se o processo morre, o step seguinte só enxerga timeout.
3. Teste o servidor por fora do Actions, já dentro da VPN: `ssh -i <chave> <SERVER_USER>@<SERVER_HOST>`. Se da sua máquina também não abre a porta 22, o bloqueio está no servidor ou no firewall, e trocar o hash não resolve.

## Certificado vencido ou trocado

O `--trusted-cert` aceita o certificado quando o hash confere, inclusive depois do `notAfter`. O gateway continua entregando o certificado vencido até a ATI publicar outro.

Quando a ATI renovar `etipi.pi.gov.br`, o fingerprint muda. O próximo deploy volta a falhar com `Gateway certificate validation failed` e o timeout na porta 22. Repita a leitura com `openssl` (ou copie o hash que o próprio log sugere) e atualize `VPN_CERT_HASH` nos dois repositórios.

Peça a renovação à ATI quando o `notAfter` já tiver passado. O pin não substitui um certificado novo.
