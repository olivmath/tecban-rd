
  
  @Injectable()
  export class WalletRepository  {
    // Função que autoriza as chamadas a API da Parfin
  async setAuthorizationToken() {
    try {
      const headers = {
        apiKey: this.configService.get<string>('X_API_KEY'),
        apiSecret: this.configService.get<string>('API_SECRET'),
        privateKey: this.configService.get<string>('PRIVATE_KEY'),
        notBefore: '5',
        issuer: this.configService.get<string>('ISSUER'),
        audience: this.configService.get<string>('AUDIENCE'),
        'Content-Type': 'application/json',
      };

      const response = await parfinApi.post(
        '/auth/token/generate/external',
        { data: {} },
        { headers },
      );

      const token = response.data.token;
      console.log('token', token);
      parfinApi.defaults.headers.common['Authorization'] = `${token}`;
    } catch (error) {
      throw new Error('Erro ao gerar o token de autorização!');
    }
  }
}