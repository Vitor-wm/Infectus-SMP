const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log('Bot online!');
});


// 📢 PAINEL
client.on('messageCreate', async (message) => {
  if (message.content === '!ticket') {

    const embed = new EmbedBuilder()
      .setTitle('🎟️ Central de Atendimento - Infectus')
      .setDescription('Escolha uma categoria abaixo para abrir seu ticket.')
      .setColor('#28361b')
      .setFooter({ text: 'Infectus SMP • Sistema de Tickets' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('suporte').setLabel('Suporte').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('denuncia').setLabel('Denúncia').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('parceria').setLabel('Parcerias').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('lore').setLabel('Lore').setStyle(ButtonStyle.Secondary)
    );

    message.channel.send({ embeds: [embed], components: [row] });
  }
});


// 🎟️ INTERAÇÕES
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  // 🔒 FECHAR (sem defer)
  if (interaction.customId === 'fechar_ticket') {
    await interaction.reply({
      content: '🔒 Fechando ticket em 3 segundos...',
      ephemeral: true
    });

    setTimeout(() => {
      interaction.channel.delete();
    }, 3000);

    return;
  }

  // 🎟️ CRIAR TICKET (usa defer aqui)
  if (!['suporte', 'denuncia', 'parceria', 'lore'].includes(interaction.customId)) return;

  await interaction.deferReply({ ephemeral: true });

  let nome = '';
  let descricao = '';
  let cargosPermitidos = [];

  if (interaction.customId === 'suporte') {
    nome = 'suporte';
    descricao = 'Explique seu problema e aguarde a equipe.';
  }

  if (interaction.customId === 'denuncia') {
    nome = 'denuncia';
    descricao = 'Descreva a denúncia com provas.';
  }

  if (interaction.customId === 'parceria') {
    nome = 'parceria';
    descricao = 'Envie informações sobre a parceria.';
    cargosPermitidos = [
      '1485702214361153696',
      '1485702287606288574',
      '1485702341268209704'
    ];
  }

  if (interaction.customId === 'lore') {
    nome = 'lore';
    descricao = 'Envie sua história/lore para avaliação.';
    cargosPermitidos = [
      '1485702625767850125',
      '1485702684303687730'
    ];
  }

  const cargoSuporte = '1485702478010912768';

  const permissionOverwrites = [
    {
      id: interaction.guild.id,
      deny: [PermissionsBitField.Flags.ViewChannel],
    },
    {
      id: interaction.user.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages
      ],
    },
    {
      id: cargoSuporte,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages
      ],
    }
  ];

  cargosPermitidos.forEach(id => {
    permissionOverwrites.push({
      id: id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages
      ],
    });
  });

  const channel = await interaction.guild.channels.create({
    name: `${nome}-${interaction.user.username}`,
    type: ChannelType.GuildText,
    permissionOverwrites: permissionOverwrites,
  });

  const embed = new EmbedBuilder()
    .setTitle(`🎟️ Ticket de ${nome}`)
    .setDescription(descricao)
    .setColor('#28361b')
    .setFooter({ text: 'Infectus SMP' });

  const fecharBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('fechar_ticket')
      .setLabel('Fechar Ticket')
      .setStyle(ButtonStyle.Danger)
  );

  let mencoes = `<@${interaction.user.id}> <@&${cargoSuporte}>`;
  cargosPermitidos.forEach(id => {
    mencoes += ` <@&${id}>`;
  });

  await channel.send({
    content: mencoes,
    embeds: interaction.customId === 'lore' ? [loreEmbed] : [embed],
    components: [fecharBtn]
  });

  await interaction.editReply({
    content: `✅ Ticket criado: ${channel}`,
  });
});

const loreEmbed = new EmbedBuilder()
.setColor('#28361b')
.setTitle('☣️ O COLAPSO')
.setDescription(`Ano 2139.
Cinquenta anos atrás, o mundo entrou em colapso.
Tudo começou com uma crescente tensão política envolvendo os Estados Unidos e o restante do mundo. Suas decisões, cada vez mais agressivas, deixaram de ser apenas influência - passaram a ser imposição. Países que não concordavam começaram a resistir. E essa resistência rapidamente virou confronto.
Ataques eram respondidos com mais ataques. Nenhum lado recuava. O planeta inteiro caminhava para uma guerra sem limites.
Pressionados, os Estados Unidos decidiram agir de forma diferente.
Longe de olhos públicos, iniciaram um projeto secreto na Antártida - um lugar onde ninguém observaria, onde ninguém interferiria. A missão não era apenas pesquisa. Era encontrar algo… qualquer coisa… que pudesse ser usado como vantagem contra o resto do mundo.
Cinco cientistas foram enviados.
Eles exploraram tudo que podiam - falhas geológicas, crateras esquecidas, túneis presos sob o gelo eterno. Horas de perfuração, silêncio absoluto, frio extremo.
Até que encontraram uma caverna.
No interior, algo impossível de ignorar: um enorme espelho de gelo puro, perfeitamente formado, como se tivesse sido moldado e não criado pela natureza. Mas o verdadeiro segredo não estava nele - e sim no que estava além.
Ao atravessarem, encontraram uma estrutura cristalina. Uma cápsula.
Ela parecia antiga… muito mais antiga do que qualquer registro humano.
E então, ao menor toque, ela se desfez.
Milhares de cristais caíram no chão. Alguns pequenos, outros maiores - todos ocos, todos frágeis. Não havia explicação lógica para aquilo.
Mas havia curiosidade.
Um dos cientistas decidiu quebrar um deles.
O gás que saiu era insuportável. Um cheiro que lembrava morte, carne em decomposição, algo que o corpo humano rejeita antes mesmo de entender.
Aquilo deveria ter sido o fim da missão.
Mas não foi.
Eles recolheram tudo. Cada fragmento. Cada cristal.
E levaram de volta para uma base de pesquisa nos Estados Unidos.
O que eles não sabiam… era que o contato já havia sido suficiente.
O vírus não agia rápido. Ele se espalhava pelo corpo em silêncio, tomando espaço, substituindo funções, apagando lentamente o que tornava alguém humano.
Quando chegaram à base, já não estavam bem.
Isolados em um laboratório monitorado 24 horas, começaram a apresentar sinais. Fraqueza. Confusão. Instabilidade.
Até que um deles simplesmente caiu.
E quando voltou… já não era mais ele.
Sem consciência, sem controle - apenas um instinto bruto. Fome. Violência. Sangue.
Um por um, os outros começaram a cair também.
O primeiro a se transformar atacou os corpos ao seu redor. A violência não era apenas matar - era consumir. E ao fazer isso, algo pior aconteceu.
Os outros começaram a se levantar.
Não como pessoas.
Mas como algo vazio.
Dentro daquele laboratório fechado, os cinco cientistas deixaram de existir. No lugar deles, restava apenas o início de algo muito maior.
Durante o caos, um deles esbarrou nos cristais que haviam sido trazidos da Antártida.
Eles caíram.
E se quebraram.
O gás se espalhou pela sala inteira.
Os sistemas de segurança reagiram imediatamente. Alarmes dispararam. As portas foram seladas. O laboratório foi isolado.
Mas já era tarde.
Os Estados Unidos, sem perceber, tinham criado - e aprisionado - a arma biológica mais devastadora da história.
E cometeram o erro final.
Na tentativa de demonstrar poder, informações sobre o projeto vazaram. Coordenadas. Dados. Indícios daquilo que estavam escondendo.
O mundo reagiu.
Um ataque surpresa foi lançado contra a base.
O míssil atingiu o alvo.
E com isso… destruiu a única coisa que mantinha o vírus contido.
O gás se espalhou.
Rápido. Invisível. Imparável.
Em questão de horas, cidades começaram a cair. Pessoas atacando pessoas. Famílias se destruindo. Nenhuma organização, nenhum exército, nenhuma fronteira foi capaz de conter.
O que era para ser a maior arma dos Estados Unidos se tornou a maior tragédia da humanidade.
E o mundo… nunca mais foi o mesmo.
`);

// 🔑 TOKEN
client.login(process.env.TOKEN);
