'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

export function ContactSection() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        outlets: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'leads'), {
                ...formData,
                outlets: Number(formData.outlets),
                createdAt: serverTimestamp()
            });
            setSuccess(true);
            setFormData({
                fullName: '',
                companyName: '',
                outlets: '',
                email: '',
                phone: '',
                message: ''
            });
        } catch (error) {
            console.error('Error adding lead:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-24 md:py-32 bg-white px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6 underline decoration-neutral-200 decoration-4 underline-offset-8">
                        Get in touch
                    </h2>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
                        Ready to scale your audits? Fill out the form below and we'll help you get started.
                    </p>
                </div>

                <div className="bg-neutral-50 rounded-[2.5rem] p-8 md:p-12 border border-neutral-100 shadow-2xl shadow-neutral-200/50">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Message received!</h3>
                            <p className="text-neutral-500 text-lg">
                                Thanks! We will be in touch within 24 hours.
                            </p>
                            <Button 
                                variant="outline" 
                                className="mt-8 rounded-full px-8" 
                                onClick={() => setSuccess(false)}
                            >
                                Send another message
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-medium ml-1">Full name</Label>
                                    <Input 
                                        id="fullName" 
                                        placeholder="John Doe" 
                                        required 
                                        className="h-12 bg-white rounded-xl border-neutral-200"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companyName" className="text-sm font-medium ml-1">Company name</Label>
                                    <Input 
                                        id="companyName" 
                                        placeholder="Acme Inc." 
                                        required 
                                        className="h-12 bg-white rounded-xl border-neutral-200"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium ml-1">Email address</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="john@example.com" 
                                        required 
                                        className="h-12 bg-white rounded-xl border-neutral-200"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium ml-1">Phone number</Label>
                                    <Input 
                                        id="phone" 
                                        type="tel" 
                                        placeholder="+1 (555) 000-0000" 
                                        required 
                                        className="h-12 bg-white rounded-xl border-neutral-200"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="outlets" className="text-sm font-medium ml-1">Number of outlets</Label>
                                <Input 
                                    id="outlets" 
                                    type="number" 
                                    placeholder="5" 
                                    required 
                                    min="1"
                                    className="h-12 bg-white rounded-xl border-neutral-200"
                                    value={formData.outlets}
                                    onChange={(e) => setFormData({...formData, outlets: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-sm font-medium ml-1">Message</Label>
                                <Textarea 
                                    id="message" 
                                    placeholder="Tell us about your auditing needs..." 
                                    required 
                                    className="min-h-[120px] bg-white rounded-xl border-neutral-200 resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-14 rounded-full text-lg font-semibold bg-neutral-900 hover:bg-neutral-800 shadow-xl shadow-neutral-900/10 transition-all active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-5 w-5" />
                                        Send message
                                    </>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
