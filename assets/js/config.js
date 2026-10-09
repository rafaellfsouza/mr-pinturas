/* =====================================================================
   MR Pinturas — Configuração central do site
   ---------------------------------------------------------------------
   É AQUI que você troca telefone, WhatsApp e e-mail sem mexer no HTML.

   Opção 1 (simples):  edite os valores de `fallback` abaixo.
   Opção 2 (Supabase): preencha `url` e `anonKey`; os dados vindos do
                       banco substituem o fallback automaticamente.
   ===================================================================== */
window.MR_CONFIG = {
    supabase: {
        // Ex.: url: "https://abcdefg1234567.supabase.co"
        url: "https://tudrrzxmssdaxiduaztc.supabase.co/rest/v1/",
        // Chave pública "anon" (Project Settings → API → anon public)
        anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZHJyenhtc3NkYXhpZHVhenRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MTQwNDIsImV4cCI6MjEwNzA5MDA0Mn0.0qflKnXmcabi1DvrU8-otRQ-y_6YgmT0dtpd_54LS_0igt "
    },

    fallback: {
        // Número no formato internacional, SOMENTE dígitos: 55 + DDD + número
        whatsappNumero: "5531983760208",
        // Mensagem pré-preenchida quando o cliente clica no botão
        whatsappMsg: "Olá! Gostaria de solicitar um orçamento para serviço de pintura.",
        // Como o telefone aparece escrito no site
        telefoneDisplay: "(31) 98376-0208",
        email: "mrpinturasemgerall@gmail.com"
    }
};
