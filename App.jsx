import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Printer, CheckCircle, 
  Clock, XCircle, DollarSign, Trash2, Edit, Eye, ArrowLeft 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('list');
  const [quotations, setQuotations] = useState([
    {
      id: 'QT-2026-001',
      clientName: 'บริษัท เอบีซี จำกัด',
      clientEmail: 'contact@abc.co.th',
      date: '2026-06-01',
      dueDate: '2026-07-01',
      status: 'approved',
      items: [
        { description: 'พัฒนาเว็บไซต์บริษัท (Corporate Website)', quantity: 1, price: 45000 },
        { description: 'ระบบดูแลเว็บไซต์รายปี', quantity: 1, price: 12000 }
      ]
    },
    {
      id: 'QT-2026-002',
      clientName: 'คุณสมชาย ใจดี',
      clientEmail: 'somchai@email.com',
      date: '2026-06-05',
      dueDate: '2026-07-05',
      status: 'pending',
      items: [
        { description: 'ออกแบบโลโก้และ Brand Identity', quantity: 1, price: 15000 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'preview'

  // ฟอร์มสำหรับสร้างใบเสนอราคาใหม่
  const [newClient, setNewClient] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDueDate, setNewDueDate] = useState('');
  const [newItems, setNewItems] = useState([{ description: '', quantity: 1, price: 0 }]);

  const addItemRow = () => {
    setNewItems([...newItems, { description: '', quantity: 1, price: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...newItems];
    updated[index][field] = value;
    setNewItems(updated);
  };

  const removeItemRow = (index) => {
    setNewItems(newItems.filter((_, i) => i !== index));
  };

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
  };

  const handleCreateQuotation = (e) => {
    e.preventDefault();
    if (!newClient || newItems.length === 0) return;

    const newId = `QT-2026-${String(quotations.length + 1).padStart(3, '0')}`;
    const newQuotation = {
      id: newId,
      clientName: newClient,
      clientEmail: newEmail,
      date: newDate,
      dueDate: newDueDate || newDate,
      status: 'pending',
      items: newItems
    };

    setQuotations([newQuotation, ...quotations]);
    setNewClient('');
    setNewEmail('');
    setNewItems([{ description: '', quantity: 1, price: 0 }]);
    setViewMode('list');
  };

  const updateStatus = (id, newStatus) => {
    setQuotations(quotations.map(q => q.id === id ? { ...q, status: newStatus } : q));
  };

  const deleteQuotation = (id) => {
    if (confirm('คุณต้องการลบใบเสนอราคานี้ใช่หรือไม่?')) {
      setQuotations(quotations.filter(q => q.id !== id));
    }
  };

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = quotations.filter(q => q.status === 'approved').reduce((sum, q) => sum + calculateSubtotal(q.items) * 1.07, 0);
  const pendingCount = quotations.filter(q => q.status === 'pending').length;
  const approvedCount = quotations.filter(q => q.status === 'approved').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navbar */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setViewMode('list')}>
            <FileText className="w-8 h-8" />
            <h1 className="text-xl font-bold">ระบบจัดการใบเสนอราคา</h1>
          </div>
          {viewMode === 'list' && (
            <button 
              onClick={() => setViewMode('create')}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-indigo-50 transition"
            >
              <Plus className="w-5 h-5" />
              <span>สร้างใบเสนอราคา</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* VIEW: LIST & DASHBOARD */}
        {viewMode === 'list' && (
          <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">ยอดขายอนุมัติรวม</p>
                  <p className="text-2xl font-bold text-slate-800">฿{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-full text-emerald-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">รออนุมัติ</p>
                  <p className="text-2xl font-bold text-amber-600">{pendingCount} รายการ</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-full text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">อนุมัติแล้ว</p>
                  <p className="text-2xl font-bold text-emerald-600">{approvedCount} รายการ</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-full text-emerald-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  placeholder="ค้นหาตามชื่อลูกค้า หรือเลขที่ใบเสนอราคา..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex space-x-2">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="pending">รออนุมัติ</option>
                  <option value="approved">อนุมัติแล้ว</option>
                  <option value="rejected">ปฏิเสธ</option>
                </select>
              </div>
            </div>

            {/* Quotation Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                      <th className="p-4">เลขที่เอกสาร</th>
                      <th className="p-4">ลูกค้า</th>
                      <th className="p-4">วันที่ออก</th>
                      <th className="p-4">ยอดสุทธิ (รวม VAT)</th>
                      <th className="p-4">สถานะ</th>
                      <th className="p-4 text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredQuotations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400">ไม่พบข้อมูลใบเสนอราคา</td>
                      </tr>
                    ) : (
                      filteredQuotations.map((q) => {
                        const subtotal = calculateSubtotal(q.items);
                        const grandTotal = subtotal * 1.07;
                        return (
                          <tr key={q.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4 font-medium text-indigo-600">{q.id}</td>
                            <td className="p-4">
                              <div className="font-medium text-slate-800">{q.clientName}</div>
                              <div className="text-xs text-slate-400">{q.clientEmail}</div>
                            </td>
                            <td className="p-4 text-slate-600 text-sm">{q.date}</td>
                            <td className="p-4 font-semibold text-slate-800">฿{grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td className="p-4">
                              <select 
                                value={q.status}
                                onChange={(e) => updateStatus(q.id, e.target.value)}
                                className={`text-xs font-semibold px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-indigo-500 ${
                                  q.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                  q.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                <option value="pending">รออนุมัติ</option>
                                <option value="approved">อนุมัติแล้ว</option>
                                <option value="rejected">ปฏิเสธ</option>
                              </select>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <button 
                                  onClick={() => { setSelectedQuotation(q); setViewMode('preview'); }}
                                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                                  title="ดูตัวอย่าง / พิมพ์"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => deleteQuotation(q.id)}
                                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                                  title="ลบเอกสาร"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CREATE FORM */}
        {viewMode === 'create' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setViewMode('list')}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-slate-800">สร้างใบเสนอราคาใหม่</h2>
              </div>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อลูกค้า / บริษัท</label>
                  <input 
                    type="text" 
                    required
                    placeholder="เช่น บริษัท ลูกค้า จำกัด"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">อีเมลลูกค้า</label>
                  <input 
                    type="email" 
                    placeholder="client@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">วันที่ออกเอกสาร</label>
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">วันครบกำหนด</label>
                  <input 
                    type="date" 
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">รายการสินค้า / บริการ</h3>
                <div className="space-y-3">
                  {newItems.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input 
                        type="text" 
                        required
                        placeholder="รายละเอียดสินค้าหรือบริการ"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="flex-1 p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input 
                        type="number" 
                        min="1"
                        required
                        placeholder="จำนวน"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        className="w-24 p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input 
                        type="number" 
                        min="0"
                        required
                        placeholder="ราคาต่อหน่วย"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', e.target.value)}
                        className="w-36 p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {newItems.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeItemRow(index)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={addItemRow}
                  className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ เพิ่มรายการสินค้า</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setViewMode('list')}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm"
                >
                  บันทึกใบเสนอราคา
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW: PREVIEW & PRINT */}
        {viewMode === 'preview' && selectedQuotation && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-4 flex justify-between items-center print:hidden">
              <button 
                onClick={() => setViewMode('list')}
                className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 font-medium flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>กลับหน้าหลัก</span>
              </button>
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center space-x-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์ / บันทึก PDF</span>
              </button>
            </div>

            {/* Printable Document Card */}
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-100 print:shadow-none print:border-none">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">ใบเสนอราคา</h2>
                  <p className="text-sm text-slate-400">QUOTATION</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600 text-lg">{selectedQuotation.id}</p>
                  <p className="text-sm text-slate-500">วันที่: {selectedQuotation.date}</p>
                  <p className="text-sm text-slate-500">ครบกำหนด: {selectedQuotation.dueDate}</p>
                </div>
              </div>

              <div className="mb-8 border-t border-b border-slate-100 py-4">
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">ลูกค้า:</p>
                <p className="text-base font-bold text-slate-800">{selectedQuotation.clientName}</p>
                <p className="text-sm text-slate-600">{selectedQuotation.clientEmail}</p>
              </div>

              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-sm">
                    <th className="py-2 text-left">รายละเอียด</th>
                    <th className="py-2 text-center">จำนวน</th>
                    <th className="py-2 text-right">ราคา/หน่วย</th>
                    <th className="py-2 text-right">ยอดรวม</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedQuotation.items.map((item, idx) => {
                    const lineTotal = item.quantity * item.price;
                    return (
                      <tr key={idx}>
                        <td className="py-3 text-slate-800">{item.description}</td>
                        <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                        <td className="py-3 text-right text-slate-600">฿{Number(item.price).toLocaleString()}</td>
                        <td className="py-3 text-right font-medium text-slate-800">฿{lineTotal.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Summary Calculations */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>รวมเป็นเงิน (Subtotal):</span>
                    <span>฿{calculateSubtotal(selectedQuotation.items).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                    <span>฿{(calculateSubtotal(selectedQuotation.items) * 0.07).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  <div className