import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import io.ktor.http.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

@Serializable
data class CalculoRequest(
    val tipoCrime: String,
    val statusApenado: String,
    val dataInicio: String,
    val penaAnos: Int,
    val penaMeses: Int,
    val penaDias: Int,
    val detracaoDias: Int
)

@Serializable
data class CalculoResponse(
    val regimeSemiaberto: String,
    val regimeAberto: String,
    val livramentoCondicional: String
)

fun converterParaDias(anos: Int, meses: Int, dias: Int): Int {
    return anos * 365 + meses * 30 + dias
}


fun obterFracao(tipoCrime: String, statusApenado: String): Double {
    return when {
        (tipoCrime.equals("não hediondo", true) || tipoCrime.equals("comum", true)) && statusApenado.equals("primario", true) -> 0.16
        (tipoCrime.equals("não hediondo", true) || tipoCrime.equals("comum", true)) && statusApenado.equals("reincidente", true) -> 0.20
        (tipoCrime.equals("hediondo", true) || tipoCrime.equals("equiparado", true)) && statusApenado.equals("primario", true) -> 0.40
        (tipoCrime.equals("hediondo", true) || tipoCrime.equals("equiparado", true)) && statusApenado.equals("reincidente", true) -> 0.60
        else -> throw IllegalArgumentException("Tipo de crime ou status inválido: $tipoCrime / $statusApenado")
    }
}

fun calcularDatas(
    penaAnos: Int,
    penaMeses: Int,
    penaDias: Int,
    dataInicioStr: String,
    detracaoDias: Int,
    tipoCrime: String,
    statusApenado: String
): CalculoResponse{

    val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    val dataInicio = LocalDate.parse(dataInicioStr, formatter)

    val penaTotalDias = converterParaDias(penaAnos, penaMeses, penaDias) - detracaoDias

    val fracaoSemiAberto = obterFracao(tipoCrime, statusApenado)

    val fracaoAberto: Double
    val fracaoLivramento: Double

    if (tipoCrime.equals("não hediondo", true) || tipoCrime.equals("comum", true)) {
        if (statusApenado.equals("primario", true)) {
            fracaoAberto = 0.5
            fracaoLivramento = 0.66
        } else {
            fracaoAberto = 0.6
            fracaoLivramento = 0.75
        }
    } else {
        if (statusApenado.equals("primario", true)) {
            fracaoAberto = 0.7
            fracaoLivramento = 0.8
        } else {
            fracaoAberto = 0.8
            fracaoLivramento = 0.9
        }
    }

    val dataSemiAberto = dataInicio.plus((penaTotalDias * fracaoSemiAberto).toLong(), ChronoUnit.DAYS)
    val dataAberto = dataInicio.plus((penaTotalDias * fracaoAberto).toLong(), ChronoUnit.DAYS)
    val dataLivramento = dataInicio.plus((penaTotalDias * fracaoLivramento).toLong(), ChronoUnit.DAYS)

    val displayFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")

    return CalculoResponse(
        regimeSemiaberto = dataSemiAberto.format(displayFormatter),
        regimeAberto = dataAberto.format(displayFormatter),
        livramentoCondicional = dataLivramento.format(displayFormatter)
    )

}

fun main() {
    embeddedServer(Netty, port = 8080) {
        
        
        install(CORS) {
            anyHost() 
            allowMethod(HttpMethod.Options) 
            allowMethod(HttpMethod.Post)   
            allowHeader(HttpHeaders.ContentType) 
        }

        install(ContentNegotiation) {
            json()
        }

        routing {
            post("/calcular") {
                val request = call.receive<CalculoRequest>()
                val resultados = calcularDatas(
                    request.penaAnos,
                    request.penaMeses,
                    request.penaDias,
                    request.dataInicio,
                    request.detracaoDias,
                    request.tipoCrime,
                    request.statusApenado
                )
                call.respond(resultados)
            }
            get("/") {
                call.respondText("Servidor da Calculadora Penal está no ar!")
            }
        }
    }.start(wait = true)
    
    println("Servidor Ktor iniciado em http://localhost:8080")
}