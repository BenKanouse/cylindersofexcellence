require 'spec_helper'

describe ApplicationHelper do

  context 'alert_for' do

    it 'should create an alert with the default class' do
      alert = alert_for('Test alert')
      expect(alert).to eq('<div class="alert alert-info"><button class="close" data-dismiss="alert">x</button><span><i class="icon-warning-sign" style="margin-right: 1em;"></i>Test alert</span></div>')
    end

    it 'should create an alert with the danger class' do
      alert = alert_for('Test alert', class: 'alert-danger')
      expect(alert).to eq('<div class="alert alert-danger"><button class="close" data-dismiss="alert">x</button><span><i class="icon-warning-sign" style="margin-right: 1em;"></i>Test alert</span></div>')
    end

  end

  context 'flash_messages' do

    context 'flash error' do
      it 'should have flash error' do
        flash[:error] = 'error message'
        expect(flash_messages).to eq("<div class=\"alert alert-danger\"><button class=\"close\" data-dismiss=\"alert\">x</button><span><i class=\"icon-warning-sign\" style=\"margin-right: 1em;\"></i>error message</span></div>".html_safe)
      end
    end

    context 'flash notice' do
      it 'should have notice alert' do
        flash[:notice] = 'notice message'
        expect(flash_messages).to eq("<div class=\"alert alert-info\"><button class=\"close\" data-dismiss=\"alert\">x</button><span><i class=\"icon-warning-sign\" style=\"margin-right: 1em;\"></i>notice message</span></div>".html_safe)
      end
    end

  end

  context 'page_header' do

    it 'should create a page header' do
      header = page_header('test header')
      expect(header).to eq('<div class="page-header"><h2>Test Header</h2></div>')
    end

    it 'should create a page header with a sub header attached' do
      header =  page_header('test header') do
        "test sub header"
      end
      expect(header).to eq('<div class="page-header"><h2>Test Header<small>test sub header</small></h2></div>')
    end

  end

  context 'panel' do

    it 'should create a panel with the default class' do
      panel = panel('Test panel') do
        "This is a test panel"
      end
      expect(panel).to eq('<div class="panel panel-default"><div class="panel-heading">Test panel</div><div class="panel-body">This is a test panel</div></div>')
    end

    it 'should create a panel with the danger class' do
      panel = panel('Test panel', class: 'panel-danger') do
        "This is a test panel"
      end
      expect(panel).to eq('<div class="panel panel-danger"><div class="panel-heading">Test panel</div><div class="panel-body">This is a test panel</div></div>')
    end

  end

  context 'table_bones' do

    it 'should create a table' do
      table = table_bones do
        "<tr><td>cell</td></tr>".html_safe
      end
      expect(table).to eq('<table class="table table-bordered table-striped table-hover"><tbody><tr><td>cell</td></tr></tbody></table>')
    end

  end

end
