
import React from 'react'

export default function PDF() {
    return (
        <div>PDF</div>
    )
}


// import React from "react";
// import {
//     PDFViewer,
//     Document,
//     Page,
//     Text,
//     View,
//     StyleSheet,
//     Image,
// } from "@react-pdf/renderer";

// export default function PDF({ incidencia }) {
//     const styles = StyleSheet.create({
//         page: {
//             padding: 40,
//             fontSize: 12,
//             fontFamily: "Helvetica",
//             lineHeight: 1.5,
//         },
//         header: {
//             textAlign: "center",
//             marginBottom: 20,
//         },
//         logo: {
//             width: 50,
//             height: 50,
//             margin: "0 auto",
//         },
//         title: {
//             fontSize: 16,
//             fontWeight: "bold",
//             textTransform: "uppercase",
//             marginTop: 5,
//         },
//         subtitle: {
//             fontSize: 12,
//             marginTop: 5,
//         },
//         row: {
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: 10,
//         },
//         text: {
//             textAlign: "justify",
//             marginBottom: 20,
//         },
//         signature: {
//             textAlign: "left",
//             marginTop: 30,
//         },
//         footer: {
//             marginTop: 20,
//             textAlign: "center",
//             fontSize: 10,
//             fontStyle: "italic",
//         },
//     });

//     return (
//         <PDFViewer style={{ width: "100%", height: "100vh" }}>
//             <Document>
//                 <Page size="A4" style={styles.page}>
//                     {/* Encabezado */}
//                     <View style={styles.header}>
//                         <Image src="/logo.png" style={styles.logo} />
//                         <Text style={styles.title}>Universidad Nacional de Cajamarca</Text>
//                         <Text style={styles.subtitle}>
//                             {incidencia.usuario.pertenencia || "Unidad no especificada"}
//                         </Text>
//                     </View>

//                     {/* Número de oficio y fecha */}
//                     <View style={styles.row}>
//                         <Text>Número de Oficio: {incidencia.id}</Text>
//                         <Text>{incidencia.fecha_inicio}</Text>
//                     </View>

//                     {/* Mensaje */}
//                     <Text style={styles.text}>{incidencia.mensaje}</Text>

//                     {/* Firma */}
//                     <View style={styles.signature}>
//                         <Text>
//                             Atentamente, {incidencia.usuario.cargo} {incidencia.usuario.nombre}
//                         </Text>
//                     </View>


//                 </Page>
//             </Document>
//         </PDFViewer>
//     );
// }
