// IMPORTAÇÕES
import React, { useEffect, useState } from 'react';
import {
  Alert,              // Exibe alertas de sucesso/erro
  FlatList,           // Lista otimizada para muitos itens
  StyleSheet,         // Criação de estilos
  Text,               // Texto na tela
  TextInput,          // Campo de entrada
  TouchableOpacity,   // Botão clicável
  View                // Container genérico
} from 'react-native';

import {
  addDoc,             // Adiciona documento no Firestore
  collection,         // Referência a uma coleção
  deleteDoc,          // Exclui documento
  doc,                // Referência a documento específico
  getDocs             // Busca documentos de uma coleção
} from 'firebase/firestore';

import { Ionicons } from '@expo/vector-icons'; // Ícones prontos
import { db } from '../firebaseConfig/firebaseConfig'; // Configuração Firebase

// MODEL
// Interface que define a estrutura dos dados de um livro
interface Livro {
  id?: string;       // ID gerado automaticamente pelo Firebase
  titulo: string;    // Título do livro
  autor: string;     // Autor
  preco: number;     // Preço
  avaliacao: string; // Avaliação
}

// COMPONENTE PRINCIPAL
export default function App() {
  // STATES - controlam os dados e inputs do app
  const [titulo, setTitulo] = useState<string>('');       // Campo título
  const [autor, setAutor] = useState<string>('');         // Campo autor
  const [preco, setPreco] = useState<string>('');         // Campo preço (formatado)
  const [avaliacao, setAvaliacao] = useState<string>(''); // Campo avaliação
  const [livros, setLivros] = useState<Livro[]>([]);      // Lista de livros cadastrados
  const [mensagemErro, setMensagemErro] = useState<string>(''); // Mensagem de erro

  // BUSCAR LIVROS - lê todos os documentos da coleção "livros"
  async function buscarLivros() {
    const querySnapshot = await getDocs(collection(db, 'livros'));
    let lista: Livro[] = [];
    querySnapshot.forEach((documento) => {
      lista.push({
        id: documento.id,              // pega o ID do documento
        ...(documento.data() as Livro) // pega os dados convertidos para Livro
      });
    });
    setLivros(lista); // atualiza o state com a lista
  }

  // FORMATAR PREÇO - transforma o input em formato monetário
  function formatarPreco(valor: string) {
    let numeros = valor.replace(/\D/g, ''); // remove tudo que não é número
    if (numeros === '') {
      setPreco('');
      return;
    }
    let valorFormatado = (Number(numeros) / 100)
      .toFixed(2)
      .replace('.', ',');
    setPreco(`R$ ${valorFormatado}`); // atualiza state com valor formatado
  }

  // VALIDAR LIVRO - checa se os campos estão corretos
  function validarLivro(): string | null {
    if (!titulo.trim()) return 'O título é obrigatório';
    if (titulo.trim().length < 3) return 'Título inválido';

    if (!autor.trim()) return 'O autor é obrigatório';
    if (autor.trim().length < 3) return 'Autor inválido';

    if (!preco.trim()) return 'O preço é obrigatório';
    const valorNumerico = Number(preco.replace('R$', '').replace(',', '.').trim());
    if (isNaN(valorNumerico)) return 'Preço inválido';
    if (valorNumerico <= 0) return 'Preço inválido';
    if (valorNumerico > 200) return 'Preço acima do limite';

    // impede duplicados
    const livroExistente = livros.find(
      (livro) => livro.titulo.toLowerCase().trim() === titulo.toLowerCase().trim()
    );
    if (livroExistente) return 'Livro já cadastrado';

    return null; // sem erros
  }

  // CADASTRAR LIVRO - adiciona novo documento no Firestore
  async function cadastrarLivro() {
    const erro = validarLivro();
    if (erro) {
      setMensagemErro(erro); // mostra erro
      return;
    }
    setMensagemErro(''); // limpa erro

    // objeto livro pronto para salvar
    const livro: Livro = {
      titulo,
      autor,
      preco: Number(preco.replace('R$', '').replace(',', '.').trim()),
      avaliacao,
    };

    await addDoc(collection(db, 'livros'), livro); // salva no Firebase
    Alert.alert('Sucesso', 'Livro cadastrado');    // alerta de sucesso

    // limpa os campos
    setTitulo('');
    setAutor('');
    setPreco('');
    setAvaliacao('');

    buscarLivros(); // atualiza lista
  }

  // EXCLUIR LIVRO - remove documento pelo ID
  async function excluirLivro(id: string) {
    await deleteDoc(doc(db, 'livros', id)); // exclui no Firebase
    Alert.alert('Sucesso', 'Livro excluído');
    buscarLivros(); // atualiza lista
  }

  // useEffect - executa buscarLivros ao carregar o app
  useEffect(() => {
    buscarLivros();
  }, []);

  // VIEW - parte visual
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 BOOKSPACE</Text>
      </View>

      {/* FORMULÁRIO */}
      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Título do livro"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Autor"
          value={autor}
          onChangeText={setAutor}
        />
        <TextInput
          style={styles.input}
          placeholder="Preço"
          keyboardType="numeric"
          value={preco}
          onChangeText={formatarPreco}
        />
        <TextInput
          style={styles.input}
          placeholder="Avaliação do livro"
          value={avaliacao}
          onChangeText={setAvaliacao}
        />

        {/* Mensagem de erro */}
        {mensagemErro !== '' && (
          <Text style={styles.erro}>⚠️ {mensagemErro}</Text>
        )}

        {/* Botão cadastrar */}
        <TouchableOpacity style={styles.botao} onPress={cadastrarLivro}>
          <Ionicons name="add-circle" size={20} color="#FFF" />
          <Text style={styles.textoBotao}>Cadastrar Livro</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA DE LIVROS */}
      <FlatList
        data={livros}
        keyExtractor={(item) => item.id!}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nomeLivro}>{item.titulo}</Text>
            <Text style={styles.info}>✍️ Autor: {item.autor}</Text>
            <Text style={styles.info}>💰 R$ {item.preco.toFixed(2)}</Text>
            <Text style={styles.info}>📌 {item.avaliacao}</Text>

            {/* Botão excluir */}
            <TouchableOpacity
              style={styles.botaoExcluir}
              onPress={() => excluirLivro(item.id!)}
            >
              <Ionicons name="trash" size={18} color="#FFF" />
              <Text style={styles.textoExcluir}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: 20,
    paddingTop: 25
  },

  // Header
  header: {
    backgroundColor: '#0A1D5C',
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 5
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2
  },

  formulario: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 5
  },
  input: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  erro: {
    color: '#5C0A0A',
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 14
  },
  botao: {
    backgroundColor: '#0A1D5C',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10
  },
  textoBotao: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  },
  card: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 4
  },
  nomeLivro: {
    fontSize: 23,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333'
  },
  info: {
    fontSize: 17,
    color: '#555',
    marginBottom: 10
  },
  botaoExcluir: {
    backgroundColor: '#700505',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  textoExcluir: {
    color: '#FFF',
    fontWeight: 'bold'
  }
});
