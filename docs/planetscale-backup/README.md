## 1

Primeiro cria um novo backup para poder fazer Roll back: (Guia backups)

![1](/docs/planetscale-backup/assets/backup-1.png)

## 2

Vá para a guia console para fazer um query manual (MySql) para prepara o banco para um mudança se possível (clique em connect no começo):

![2](/docs/planetscale-backup/assets/backup-2.png)

## 3

Volte para a guia backups e crie uma nova branch a partir do backup feito:
(clique na branch e seleciona ela antes), depois disso clique em `restore to new branch` para criar uma branch a partir do backup.

![3](/docs/planetscale-backup/assets/backup-3.png)

## 4

Depois disso precisa promover a branch para produção:
na guia branches selecione `Promote branch to production`:

![4](/docs/planetscale-backup/assets/backup-4.png)

## 5

Uma vez promovida é preciso marcar a branch como default no dashboard de branches para garantir que vai fazer o update dos dados:
Para isso clique no ícone default (que provavelemente estará associado à outra branch no momento:

![5](/docs/planetscale-backup/assets/backup-5.png)

## 6

Esse pop-up é aberto clique no botão azul `database settings page`

![6](/docs/planetscale-backup/assets/backup-6.png)

## 7

No drop-down seleciona a nova branch que é para ser a default

![7.1](/docs/planetscale-backup/assets/backup-7.1.png)

![7.2](/docs/planetscale-backup/assets/backup-7.2.png)

## 8

Depois disso pode apagar a antiga branch que era `default`
