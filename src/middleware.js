// 'use client'

import { NextResponse } from "next/server";

export function middleware(request) {
    const appSession = request.cookies.get("appSession");

    const allCookies = request.cookies.getAll();

    if (request.nextUrl.pathname === "/") {
        // console.log("Estoy en home");
        if (appSession) {
            // console.log('inicie sesion');
        } else {
            // console.log('cerre sesion');
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } else if (request.nextUrl.pathname === "/login") {
        // console.log("Estoy en login");
        if (appSession) {
            // console.log('inicie sesion');
            return NextResponse.redirect(new URL("/", request.url));
        } else {
            // console.log('cerre sesion');
        }
    } else if (request.nextUrl.pathname.includes("/incidencias")) {
        // console.log("Estoy en home");
        if (appSession) {
            // console.log('inicie sesion');
        } else {
            // console.log('cerre sesion');
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: ["/", "/login", "/product/:path*"],
};

// if (request.nextUrl.pathname.includes("/")) {
//   console.log('Estoy en home');

//   if(!appSession){

//   }else{

//   }

//   // return NextResponse.redirect(new URL("/login", request.url));
// }

// import { NextResponse } from 'next/server';

// export function middleware(request) {

//   // const cookie = request.cookies.get('myTokenName')

//   if (request.nextUrl.pathname.includes('/login')) {
//     if(cookie === undefined){
//       return NextResponse.redirect(new URL('/login', request.url))
//     }
//     console.log('Login route accessed');
//   }

//   return NextResponse.next();
// }

// if (request.nextUrl.pathname.includes('/login')) {
//   if(cookie === undefined){
//     return NextResponse.redirect(new URL('/login', request.url))
//   }
//   console.log('Login route accessed');
// }

// matcher: ["/user/:path*", "/product/:path*"],