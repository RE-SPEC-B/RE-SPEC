# RE:SPEC 메인 프로젝트

>**주제** : 취업에 성공한 우리 학교 선배 ● 내가 원하는 직군의 인생 선배를 만나 리:스펙 하는 플랫폼

- 자신이 궁금한 회사, 직무, 업계, 학교 사람(선배 & 멘토)과 자유로운 1:1 커리어 대화 연결 서비스
- 통합 로그인, 관련 커뮤니티, 멘토 추천, 사용자 기반 추천 서비스, 일정관리, 결제 시스템 etc

## Contents

- [Features](#Project-Features)
- [ToDo](#Project-ToDo)
- [Summary Note](#Project-Summary-Note)
- [Module](#Dependency-Module)

## Project Features

1. 멘토 추천 부분 DB 설계 & 연동 (user, job, keyword, follow...) `계속 업데이트 예정`

## Project ToDo

1. 소셜 로그인 (카카오, 네이버, 구글, 로컬) & 로그아웃
2. 멘토 찾기 & 검색 API 설계

## Project Summary Note
> Click Notion icon

👉 [![Notion](https://img.shields.io/badge/Notion-000000.svg?style=flat&logo=Notion&logoColor=white)](https://quilt-tanker-16d.notion.site/RE-SPEC-1c8f389a7b924283a8c5401e07ff334a)

## Dependency Module

```
  "dependencies": {
    "body-parser": "^1.20.1",
    "config": "^3.3.8",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "morgan": "^1.10.0",
    "mysql": "^2.18.1",
    "mysql2": "^2.3.3",
    "sequelize": "^6.25.7",
    "sequelize-cli": "^6.5.2",
    "winston": "^3.8.2",
    "winston-daily-rotate-file": "^4.7.1"
  },
  "devDependencies": {
    "eslint": "^8.27.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "^4.2.1",
    "prettier": "^2.7.1",
    "standard-version": "^9.5.0"
  }
```
