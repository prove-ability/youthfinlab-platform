"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, TrendingUp } from "lucide-react";

const MARKET_LABELS: Record<string, { label: string; flag: string }> = {
  KR: { label: "한국", flag: "🇰🇷" },
  US: { label: "미국", flag: "🇺🇸" },
  JP: { label: "일본", flag: "🇯🇵" },
  CN: { label: "중국", flag: "🇨🇳" },
};
import {
  createStock,
  updateStock,
  deleteStock,
  type CreateStockData,
  type UpdateStockData,
} from "@/actions/stockActions";
import { Stock } from "@/types";

interface StockManagementProps {
  stocks: Stock[];
  onStockCreated: (stock: Stock) => void;
  onStockUpdated: (stock: Stock) => void;
  onStockDeleted: (stockId: string) => void;
}

export default function StockManagement({
  stocks,
  onStockCreated,
  onStockUpdated,
  onStockDeleted,
}: StockManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateStockData>({
    name: "",
    industrySector: "",
    remarks: "",
    marketCountryCode: "KR",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      industrySector: "",
      remarks: "",
      marketCountryCode: "KR",
    });
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      const result = await createStock(formData);
      // ActionState 체크: success 필드가 있으면 에러 응답
      if ("success" in result && !result.success) {
        alert(result.message || "주식 생성에 실패했습니다.");
        return;
      }
      // 타입 단언: ActionState가 아니므로 Stock 타입
      const stock = result as Stock;
      setIsCreateDialogOpen(false);
      resetForm();
      onStockCreated(stock);
    } catch (error) {
      console.error("주식 생성 실패:", error);
      alert("주식 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingStock || !formData.name.trim()) return;

    setLoading(true);
    try {
      const updateData: UpdateStockData = {
        id: editingStock.id,
        ...formData,
      };
      const result = await updateStock(updateData);
      // ActionState 체크: success 필드가 있으면 에러 응답
      if ("success" in result && !result.success) {
        alert(result.message || "주식 수정에 실패했습니다.");
        return;
      }
      // 타입 단언: ActionState가 아니므로 Stock 타입
      const stock = result as Stock;
      setIsEditDialogOpen(false);
      setEditingStock(null);
      resetForm();
      onStockUpdated(stock);
    } catch (error) {
      console.error("주식 수정 실패:", error);
      alert("주식 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (stock: Stock) => {
    if (!confirm(`"${stock.name}" 주식을 삭제하시겠습니까?`)) return;

    setLoading(true);
    try {
      await deleteStock(stock.id);
      onStockDeleted(stock.id);
    } catch (error) {
      console.error("주식 삭제 실패:", error);
      alert("주식 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (stock: Stock) => {
    setEditingStock(stock);
    setFormData({
      name: stock.name,
      industrySector: stock.industrySector || "",
      remarks: stock.remarks || "",
      marketCountryCode: stock.marketCountryCode,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              종목 목록
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                총 {stocks.length}개
              </span>
            </CardTitle>
            <CardDescription>게임에서 사용할 주식 종목을 관리합니다</CardDescription>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={resetForm} size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                종목 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>새 종목 추가</DialogTitle>
                <DialogDescription>
                  게임에서 사용할 주식 종목 정보를 입력하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="name" className="text-sm font-medium">
                      주식명 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="예: 삼성전자"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="industrySector" className="text-sm font-medium">
                      산업 섹터
                    </Label>
                    <Input
                      id="industrySector"
                      value={formData.industrySector}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, industrySector: e.target.value })
                      }
                      placeholder="예: 반도체"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="marketCountryCode" className="text-sm font-medium">
                      시장 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.marketCountryCode}
                      onValueChange={(value: "KR" | "US" | "JP" | "CN") =>
                        setFormData({ ...formData, marketCountryCode: value })
                      }
                    >
                      <SelectTrigger id="marketCountryCode">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KR">🇰🇷 한국 (KR)</SelectItem>
                        <SelectItem value="US">🇺🇸 미국 (US)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="remarks" className="text-sm font-medium">
                      비고
                      <span className="ml-1 text-xs font-normal text-muted-foreground">선택사항</span>
                    </Label>
                    <Textarea
                      id="remarks"
                      value={formData.remarks || ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData({ ...formData, remarks: e.target.value })
                      }
                      placeholder="추가 정보나 설명을 입력하세요"
                      className="resize-none h-20"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">*</span> 는 필수 입력 항목입니다
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={loading || !formData.name.trim()}
                >
                  {loading ? "추가 중..." : "종목 추가"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">등록된 종목이 없습니다</p>
              <p className="text-xs text-muted-foreground">위의 버튼을 눌러 첫 번째 종목을 추가하세요.</p>
            </div>
          ) : (
            stocks.map((stock) => {
              const market = MARKET_LABELS[stock.marketCountryCode] ?? { label: stock.marketCountryCode, flag: "🌐" };
              return (
                <div
                  key={stock.id}
                  className="flex items-center justify-between px-4 py-3 border rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">{stock.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                          {market.flag} {market.label}
                        </span>
                        {stock.industrySector && (
                          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                            {stock.industrySector}
                          </span>
                        )}
                        {stock.remarks && (
                          <span className="text-xs text-muted-foreground">
                            {stock.remarks}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(stock)}
                      className="h-8 px-2.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(stock)}
                      disabled={loading}
                      className="h-8 px-2.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      삭제
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 수정 다이얼로그 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>종목 수정</DialogTitle>
              <DialogDescription>
                {editingStock?.name} 종목 정보를 수정하세요
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="edit-name" className="text-sm font-medium">
                    주식명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="예: 삼성전자"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-industrySector" className="text-sm font-medium">
                    산업 섹터
                  </Label>
                  <Input
                    id="edit-industrySector"
                    value={formData.industrySector}
                    onChange={(e) =>
                      setFormData({ ...formData, industrySector: e.target.value })
                    }
                    placeholder="예: 반도체"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-marketCountryCode" className="text-sm font-medium">
                    시장 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.marketCountryCode}
                    onValueChange={(value: "KR" | "US" | "JP" | "CN") =>
                      setFormData({ ...formData, marketCountryCode: value })
                    }
                  >
                    <SelectTrigger id="edit-marketCountryCode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KR">🇰🇷 한국 (KR)</SelectItem>
                      <SelectItem value="US">🇺🇸 미국 (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="edit-remarks" className="text-sm font-medium">
                    비고
                    <span className="ml-1 text-xs font-normal text-muted-foreground">선택사항</span>
                  </Label>
                  <Textarea
                    id="edit-remarks"
                    value={formData.remarks || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    placeholder="추가 정보나 설명을 입력하세요"
                    className="resize-none h-20"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">*</span> 는 필수 입력 항목입니다
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                취소
              </Button>
              <Button
                onClick={handleEdit}
                disabled={loading || !formData.name.trim()}
              >
                {loading ? "수정 중..." : "수정"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
