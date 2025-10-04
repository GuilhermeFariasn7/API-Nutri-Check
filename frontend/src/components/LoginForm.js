import React from "react";
/* import { useAuth } from '@/contexts/AuthContext'; */
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, UserCheck, AlertCircle } from 'lucide-react';
/* import { toast } from '@/hooks/use-toast'; */
function LoginForm() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-secondary-light p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-4">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Padroniza
                    </h1>
                    <p className="text-muted-foreground">
                        Gestão de boas práticas para serviços de alimentação
                    </p>
                </div>

                <Card className="shadow-lg-custom">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Acesso ao Sistema</CardTitle>
                        <CardDescription className="text-center">
                            Digite suas credenciais para continuar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Usuário</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Digite seu usuário"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="transition-custom"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="transition-custom"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full gradient-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Verificando...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <UserCheck className="w-4 h-4" />
                                        <span>Entrar</span>
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 p-4 bg-secondary/20 border border-secondary rounded-lg">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-primary">Acesso Padrão:</p>
                                    <p className="text-foreground">Usuário: <code className="bg-primary/10 px-1 rounded font-mono text-primary">admin</code></p>
                                    <p className="text-foreground">Senha: <code className="bg-primary/10 px-1 rounded font-mono text-primary">admin</code></p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
export default LoginForm;