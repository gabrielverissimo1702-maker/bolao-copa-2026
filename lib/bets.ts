import { supabase } from './supabase'

export async function buscarTodosPalpites() {

  const tamanhoPagina =
    1000

  let paginaAtual =
    0

  let todos: any[] =
    []

  while (true) {

    const inicio =
      paginaAtual *
      tamanhoPagina

    const fim =
      inicio +
      tamanhoPagina -
      1

    const {
      data,
      error
    } =
      await supabase
        .from('bets')
        .select('*')
        .range(
          inicio,
          fim
        )

    if (error) {
      console.error(
        'Erro ao buscar palpites:',
        error
      )
      break
    }

    todos =
      todos.concat(
        data || []
      )

    if (
      !data ||
      data.length <
        tamanhoPagina
    ) {
      break
    }

    paginaAtual += 1

  }

  return todos

}
